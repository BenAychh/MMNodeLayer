'use strict';
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var rp = require('request-promise');
var matchService = 'http://localhost:8002/';
var emailValidator = require('email-validator');

var secretKey = process.env.secretKey;
if (!secretKey) {
  secretKey = 'shhhhh';
}

router.get('/suggested', (req, res, next) => {
  if (req.query.token) {
    jwt.verify(req.query.token, secretKey, function(err, decoded) {
      if (!err) {
        let updateOptions = {
          method: 'get',
          uri: matchService + "suggestions?email=" + decoded.email,
        };
        rp(updateOptions)
        .then(parsedBody => {
          console.log(parsedBody);
          res.status(200);
          res.json({
            message: 'Returning suggested matches',
            suggestedMatches: parsedBody.suggestedMatches || [],
            status: 200,
          })
        })
        .catch(errorBody => {
          res.status(errorBody.statusCode);
          res.json({
            message: errorBody.message,
            status: errorBody.statusCode,
          });
          return;
        })

      } else {
        console.log(decoded);
        res.status(401);
        res.json({
          message: 'Invalid token, please log out then log back in',
          status: 401,
        })
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

router.put('/interest', (req, res, next) => {
  if (req.body.token) {
    if (req.body.interestedIn) {
      if (emailValidator.validate(req.body.interestedIn)) {
        jwt.verify(req.body.token, secretKey, function(err, decoded) {
          if (!err) {
            let interestOptions = {
              method: 'PUT',
              uri: matchService + "addinterest",
              body: {
                  email: decoded.email,
                  interestedIn: req.body.interestedIn,
              },
              json: true // Automatically stringifies the body to JSON
            };
            rp(interestOptions)
            .then(parsedBody => {
              res.status(200);
              res.json({
                message: parsedBody.message,
                status: 200,
              })
            })
            .catch(errorBody => {
              res.status(errorBody.statusCode);
              res.json({
                message: errorBody.message,
                status: errorBody.statusCode,
              });
              return;
            })
          } else {
            res.status(401);
            res.json({
              message: 'Invalid token, please log out then log back in',
              status: 401,
            })
            return;
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
        status: 400,
        message: 'Please include the email of the user you are interested in',
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
router.put('/uninterest', (req, res, next) => {
  if (req.body.token) {
    if (req.body.uninterestedIn) {
      if (emailValidator.validate(req.body.uninterestedIn)) {
        jwt.verify(req.body.token, secretKey, function(err, decoded) {
          if (!err) {
            let uninterestOptions = {
              method: 'PUT',
              uri: matchService + "removeinterest",
              body: {
                  email: decoded.email,
                  uninterestedIn: req.body.uninterestedIn,
              },
              json: true // Automatically stringifies the body to JSON
            };
            rp(uninterestOptions)
            .then(parsedBody => {
              res.status(200);
              res.json({
                message: parsedBody.message,
                status: 200,
              })
            })
            .catch(errorBody => {
              res.status(errorBody.statusCode);
              res.json({
                message: errorBody.message,
                status: errorBody.statusCode,
              });
              return;
            })
          } else {
            res.status(401);
            res.json({
              message: 'Invalid token, please log out then log back in',
              status: 401,
            })
            return;
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
        status: 400,
        message: 'Please include the email of the user you are removing interest in',
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
router.get('/getinterest', (req, res, next) => {
  if (req.query.token) {
    jwt.verify(req.query.token, secretKey, function(err, decoded) {
      if(!err) {
        let interestedOptions = {
          method: 'GET',
          uri: matchService + "interested?email=" + decoded.email,
        };
        rp(interestedOptions)
        .then(parsedBody => {
          res.status(200);
          res.json({
            list: JSON.parse(parsedBody).interests,
            message: 'Here are the users you have shown interest in',
            status: 200,
          })
        })
        .catch(errorBody => {
          console.log(errorBody);
          res.status(errorBody.statusCode);
          res.json({
            message: errorBody.message,
            status: errorBody.statusCode,
          });
          return;
        })
      } else {
        res.status(401);
        res.json({
          message: 'Invalid token, please log out then log back in',
          status: 401,
        })
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
router.get('/getmatches', (req, res, next) => {
  if (req.query.token) {
    jwt.verify(req.query.token, secretKey, function(err, decoded) {
      if(!err) {
        let interestedOptions = {
          method: 'GET',
          uri: matchService + "matches?email=" + decoded.email,
        };
        rp(interestedOptions)
        .then(parsedBody => {
          res.status(200);
          res.json({
            list: JSON.parse(parsedBody).matches,
            message: 'Here are your matches',
            status: 200,
          })
        })
        .catch(errorBody => {
          console.log(errorBody);
          res.status(errorBody.statusCode);
          res.json({
            message: errorBody.message,
            status: errorBody.statusCode,
          });
          return;
        })
      } else {
        res.status(401);
        res.json({
          message: 'Invalid token, please log out then log back in',
          status: 401,
        })
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