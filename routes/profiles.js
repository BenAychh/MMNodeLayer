'use strict';
var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var emailValidator = require('email-validator');
var validUrl = require('valid-url');
var jwt = require('jsonwebtoken');
var algorithm = require('../algorithm/algorithm.js');
var aws = require('aws-sdk');
var authService = 'http://localhost:8000/';
var profileService = 'http://localhost:8001/';
var matchService = 'http://localhost:8002/';

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || 'AKIAJCKL57PAMZB54LAQ';
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || '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';
var S3_BUCKET = process.env.S3_BUCKET || 'mmprofilesimages';

var secretKey = process.env.SECRET_KEY;
if (!secretKey) {
  secretKey = 'shhhhh';
}

router.put('/update', (req, res, next) => {
  if (req.body.token) {
    jwt.verify(req.body.token, secretKey, function(err, decoded) {
      if (!err) {
        delete req.body.token;
        req.body.email = decoded.email;
        if (!isNaN(req.body.displayName)) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Please provide a display name that is text less than 50 characters',
            form: req.body,
          })
          return;
        }
        if (!req.body.displayName) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Please provide a display name that is text less than 50 characters',
            form: req.body,
          })
          return;
        }
        if (req.body.displayName.length > 50) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Please provide a display name that is text less than 50 characters',
            form: req.body,
          })
          return;
        }
        if (req.body.lastName && !isNaN(req.body.lastName)) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Please enter a last name that is text and less than 30 characters',
            form: req.body,
          });
          return;
        }
        if (req.body.lastName && req.body.lastName.length > 30) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Please enter a last name that is text and less than 30 characters',
            form: req.body,
          });
          return;
        }
        if (req.body.lastName && !decoded.isTeacher) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Schools may not have a last name',
            form: req.body,
          });
          return;
        }
        if (req.body.description && !isNaN(req.body.description)) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Please enter a description that is text and less than 500 characters',
            form: req.body,
          });
          return;
        }
        if (req.body.description && req.body.description.length > 500) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Please enter a description that is text and less than 500 characters',
            form: req.body,
          });
          return;
        }
        var states = [
          "AL", "AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FM", "FL",
          "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MH",
          "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM",
          "NY", "NC", "ND", "MP", "OH", "OK", "OR", "PW", "PA", "PR", "RI", "SC",
          "SD", "TN", "TX", "UT", "VT", "VI", "VA", "WA", "WV", "WI", "WY"
        ]
        if (req.body.state && states.indexOf(req.body.state) === -1) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Please enter a two-letter state abbreviation',
            form: req.body,
          });
          return;
        }
        if (req.body.avatarUrl && !validUrl.isUri(req.body.avatarUrl)) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Please enter a valid url for your profile image',
            form: req.body,
          });
          return;
        }
        let updateOptions = {
          method: 'PUT',
          uri: profileService + "update",
          body: req.body,
          json: true // Automatically stringifies the body to JSON
        };
        rp(updateOptions)
          .then(parsedBody => {
            res.status(200);
            res.json({
              message: 'Profile updated for ' + decoded.email,
              status: 200,
            })
          })
          .catch(errorBody => {
            res.status(errorBody.statusCode);
            res.json({
              message: errorBody.message,
              status: errorBody.statusCode,
            })
          })
      } else {
        res.status(403);
        res.json({
          message: 'Your token appears invalid, please log back in',
          status: 401,
        })
        return;
      }
    });
  } else {
    res.status(403);
    res.json({
      message: 'Please log in',
      status: 403,
    })
  }
});
router.post('/makematchprofile', (req, res, next) => {
  if (req.body.token) {
    jwt.verify(req.body.token, secretKey, function(err, decoded) {
      if (!err) {
        delete req.body.token;
        req.body.email = decoded.email;
        let validWeights = [1, 10, 50, 100];
        let unWeighted = {};
        let weighted = {
          training: [0, 1, 2, 3, 4, 5],
          locTypes: [0, 1, 2, 3],
          orgTypes: [0, 1, 2, 3, 4, 5, 6, 7],
          sizes: [0, 1, 2, 3],
          cals: [0, 1],
          states: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
          traits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 17, 18, 19],
          ageRanges: [0, 1, 2, 3, 4, 5]
        };
        let schoolSingletons = [
          'locTypes',
          'orgTypes',
          'sizes',
          'cals',
          'states',
        ]
        let inputKeys = Object.keys(req.body);
        let missing = [];
        let malformed = [];
        let invalid = {};
        Object.keys(unWeighted).forEach(key => {
          if (inputKeys.indexOf(key) == -1) {
            missing.push(key);
          } else if (!Array.isArray(req.body[key])) {
            malformed.push(key);
          } else if (!decoded.isTeacher && schoolSingletons.indexOf(key) !== -1 && req.body[key].length > 1) {
            malformed.push(key);
          } else {
            let invalids = [];
            req.body[key].forEach(value => {
              if (unWeighted[key].indexOf(value) == -1) {
                invalids.push(value);
              }
            })
            if (invalids.length > 0) {
              invalid[key] = invalids;
            }
          }
        })
        Object.keys(weighted).forEach(key => {
          if (inputKeys.indexOf(key) == -1) {
            missing.push(key);
          } else if (!Array.isArray(req.body[key])) {
            malformed.push(key);
          } else if (!decoded.isTeacher && schoolSingletons.indexOf(key) !== -1 && req.body[key].length > 1) {
            malformed.push(key);
          } else {
            let invalids = [];
            req.body[key].forEach(value => {
              if (weighted[key].indexOf(value) == -1) {
                invalids.push(value);
              }
            })
            if (invalids.length > 0) {
              invalid[key] = invalids;
            }
          }
          if (inputKeys.indexOf(key + "Wgt") == -1) {
            missing.push(key + "Wgt");
          } else if (validWeights.indexOf(Number(req.body[key + "Wgt"])) == -1) {
            invalid[key + "Wgt"] = req.body[key + "Wgt"];
          }
        });
        if (missing.length === 0 && malformed.length === 0 && Object.keys(invalid).length === 0) {
          req.body.isTeacher = decoded.isTeacher;
          req.body.active = true;
          let updateOptions = {
            method: 'PUT',
            uri: matchService + "upsert",
            body: req.body,
            json: true // Automatically stringifies the body to JSON
          };
          rp(updateOptions)
            .then(parsedBody => {
              res.status(200);
              res.json({
                message: parsedBody.message,
                status: 200,
              })
              return;
            })
            .catch(errorBody => {
              res.status(errorBody.statusCode);
              res.json({
                message: errorBody.message,
                status: errorBody.statusCode,
              });
            })
        } else {
          res.status(400);
          res.json({
            message: 'Please completely fill out the profile',
            status: 400,
            missing: missing,
            invalid: invalid,
            malformed: malformed,
          })
          return;
        }
      } else {
        res.status(401);
        res.json({
          message: 'Your token appears invalid, please log back in',
          status: 401,
        });
        return;
      }
    });
  } else {
    res.status(401);
    res.json({
      message: 'Please log in',
      status: 401,
    })
    return;
  }
});

router.put('/follow', (req, res, next) => {
  if (req.body.token) {
    if (req.body.followEmail) {
      if (emailValidator.validate(req.body.followEmail)) {
        jwt.verify(req.body.token, secretKey, function(err, decoded) {
          if (!err) {
            if (decoded.isTeacher) {
              let followOptions = {
                method: 'PUT',
                uri: profileService + "follow",
                body: {
                  email: decoded.email,
                  follow: req.body.followEmail,
                },
                json: true // Automatically stringifies the body to JSON
              };
              rp(followOptions)
                .then(parsedBody => {
                  res.status(parsedBody.status);
                  res.json(parsedBody);
                })
                .catch(errorBody => {
                  res.status(errorBody.statusCode);
                  res.json({
                    status: errorBody.statusCode,
                    message: errorBody.error.message,
                  });
                })
            } else {
              res.status(403);
              res.json({
                message: 'Only other teachers may follow teachers',
                status: 403,
              })
            }
          } else {
            res.status(401);
            res.json({
              message: 'Invalid token',
              status: 401,
            })
          }
        });
      } else {
        res.status(400);
        res.json({
          message: 'Invalid email, check the syntax and try again',
          status: 400,
        })
        return;
      }
    } else {
      res.status(400);
      res.json({
        message: 'Please provide the email of the user you want to follow',
        status: 400,
      })
      return;
    }
  } else {
    res.status(401);
    res.json({
      message: 'Please log in',
      status: 401,
    })
    return;
  }
});
router.put('/unfollow', (req, res, next) => {
  if (req.body.token) {
    if (req.body.unfollowEmail) {
      if (emailValidator.validate(req.body.unfollowEmail)) {
        jwt.verify(req.body.token, secretKey, function(err, decoded) {
          if (!err) {
            if (decoded.isTeacher) {
              let followOptions = {
                method: 'PUT',
                uri: profileService + "unfollow",
                body: {
                  email: decoded.email,
                  unfollow: req.body.unfollowEmail,
                },
                json: true // Automatically stringifies the body to JSON
              };
              rp(followOptions)
                .then(parsedBody => {
                  res.status(parsedBody.status);
                  res.json(parsedBody);
                })
                .catch(errorBody => {
                  res.status(errorBody.statusCode);
                  res.json({
                    status: errorBody.statusCode,
                    message: errorBody.error.message,
                  });
                })
            } else {
              res.status(403);
              res.json({
                message: 'Only other teachers may follow teachers',
                status: 403,
              })
            }
          } else {
            res.status(401);
            res.json({
              message: 'Invalid token',
              status: 401,
            })
          }
        });
      } else {
        res.status(400);
        res.json({
          message: 'Invalid email, check the syntax and try again',
          status: 400,
        })
        return;
      }
    } else {
      res.status(400);
      res.json({
        message: 'Please provide the email of the user you want to unfollow',
        status: 400,
      })
      return;
    }
  } else {
    res.status(401);
    res.json({
      message: 'Please log in',
      status: 401,
    })
    return;
  }
});
router.get('/getmyprofile', (req, res, next) => {
  if (req.query.token) {
    jwt.verify(req.query.token, secretKey, function(err, decoded) {
      if (!err) {
        let updateOptions = {
          method: 'GET',
          uri: profileService + "get?profile=" + decoded.email,
          json: true,
        };
        rp(updateOptions)
          .then(parsedBody => {
            res.status(200);
            res.json({
              message: 'Returning profile',
              profile: parsedBody.profile,
              status: 200,
            })
            return;
          })
          .catch(errorBody => {
            res.status(errorBody.statusCode);
            res.json({
              message: errorBody.error.message,
              status: errorBody.statusCode,
            });
          })
      } else {
        res.status(401);
        res.json({
          message: 'Bad token',
          status: 401,
        })
      }
    });
  } else {
    res.status(401);
    res.json({
      message: 'Please log in',
      status: 401
    })
  }
})
router.get('/get', (req, res, next) => {
  if (req.query.token) {
    if (req.query.profile) {
      jwt.verify(req.query.token, secretKey, function(err, decoded) {
        if (!err) {
          let promises = [];
          let getProfile = {
            method: 'GET',
            url: profileService + 'get?profile=' + req.query.profile,
            json: true // Automatically stringifies the body to JSON
          }
          promises.push(rp(getProfile));
          let checkMatch = {
            method: 'GET',
            uri: matchService + "relationship?email=" + decoded.email + "&match=" + req.query.profile,
            json: true // Automatically stringifies the body to JSON
          };
          promises.push(rp(checkMatch));
          let getTeacherMatchProfile = {
            method: 'GET',
            uri: matchService + "matchprofile?email=" + decoded.email,
            json: true // Automatically stringifies the body to JSON
          };
          promises.push(rp(getTeacherMatchProfile));
          let getProfileMatchProfile = {
            method: 'GET',
            uri: matchService + "matchprofile?email=" + req.query.profile,
            json: true // Automatically stringifies the body to JSON
          };
          promises.push(rp(getProfileMatchProfile));
          let getProfileIsTeacher = {
            method: 'GET',
            uri: authService + "isteacher?email=" + req.query.profile,
            json: true // Automatically stringifies the body to JSON
          };
          promises.push(rp(getProfileIsTeacher));
          Promise.all(promises)
            .then(results => {
              if (!results[1].match) {
                delete results[0].profile.email;
                delete results[0].profile.displayName;
                delete results[0].profile.lastName;
              }
              delete results[0].profile.password;
              delete results[0].profile.followedAndStaff;
              results[0].profile.interest = results[1].interested;
              if (results[2].profile && results[3].profile) {
                results[0].profile.matchPercent = JSON.parse(results[3].profile).matchSuggestions.filter(match => {
                  return match.email === decoded.email;
                })[0].perc || 0;
                results[0].myMatchProfile = JSON.parse(results[2].profile);
                results[0].theirMatchProfile = JSON.parse(results[3].profile);
                delete results[0].theirMatchProfile._id;
                delete results[0].theirMatchProfile.email;
                delete results[0].theirMatchProfile.matchSuggestions;
              }
              results[0].profile.isTeacher = results[4].isTeacher;
              res.status(200);
              res.json({
                message: "Here is the profile for " + req.query.profile,
                profile: results[0].profile,
                myMatchProfile: results[0].myMatchProfile,
                theirMatchProfile: results[0].theirMatchProfile,
                status: 200,
              })
            })
            .catch(errorBody => {
              res.send('error! ' + errorBody)
            })

        } else {
          res.status(401);
          res.json({
            message: 'Invalid token',
            status: 401,
          })
        }
      });
    } else {
      res.status(400);
      res.json({
        message: 'Profile does not exist in database',
        status: 400,
      })
      return;
    }
  } else {
    res.status(401);
    res.json({
      message: 'Please log in',
      status: 401,
    })
    return;
  }
})
router.get('/signS3', (req, res) => {
  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  });
  var s3 = new aws.S3();
  var fileName = new Date().getTime() + req.query.fileName.substring(req.query.fileName.lastIndexOf('.'));
  var s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: req.query.fileType,
    ACL: 'public-read',
  };
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      var returnData = {
        signedRequest: data,
        url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + fileName,
      };
      res.json(returnData);
    }
  });
});



module.exports = router;
