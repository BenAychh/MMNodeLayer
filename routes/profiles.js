'use strict';
var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var emailValidator = require('email-validator');
var validUrl = require('valid-url');
var jwt = require('jsonwebtoken');

var authService = 'http://localhost:8000/';
var profileService = 'http://localhost:8001/';
var matchService = 'http://localhost:8002/';

var secretKey = process.env.secretKey;
if (!secretKey) {
  secretKey = 'shhhhh';
}

router.post('/update', (req, res, next) => {
  if (req.body.token) {
    jwt.verify(req.body.token, secretKey, function(err, decoded) {
      if (!err) {
        delete req.body.token;
        req.body.email = decoded.email;
        if (!isNaN(req.body.displayName)) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Please provide a display name that is text 50 characters or less',
            form: req.body,
          })
          return;
        }
        if (req.body.displayName.length > 50) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Please provide a display name that is text 50 characters or less',
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
        if (req.body.description && !isNaN(req.body.description)) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Please provide a description that is text and less than 500 characters',
            form: req.body,
          });
          return;
        }
        if (req.body.description && req.body.description.length > 500) {
          res.status(400);
          res.json({
            status: 400,
            message: 'Please provide a description that is text and less than 500 characters',
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
            message: 'Profile updated',
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
  if (req.body.token){
    jwt.verify(req.body.token, secretKey, function(err, decoded) {
      if (!err) {
        delete req.body.token;
        req.body.email = decoded.email;
        let validWeights = [1, 10, 50, 100];
        let unWeighted = {
        };
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
          res.status(401);
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
})

module.exports = router;
