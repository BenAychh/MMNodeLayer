'use strict';
const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const emailValidator = require('email-validator');
const validUrl = require('valid-url');
const jwt = require('jsonwebtoken');
const signUpValidator = require('../validators/signUpValidator')
const loginValidator = require('../validators/loginValidator')

var authService = process.env.AUTH_SERVICE_IP || 'localhost:8000'
var profileService = process.env.PROFILE_SERVICE_IP || 'localhost:8001'
var matchService = process.env.MATCH_SERVICE_IP || 'localhost:8002'

var secretKey = process.env.SECRET_KEY;
if (!secretKey) {
  secretKey = 'shhhhh';
}

router.post('/signup', (req, res, next) => {
  return signUpValidator(req, res)
  .then((result) => {
    if (result) {
      let authOptions = {
        method: 'POST',
        uri: authService + "create",
        body: {
            email: req.body.email,
            password: req.body.password,
            isTeacher: req.body.isTeacher,
        },
        json: true // Automatically stringifies the body to JSON
      };
      return rp(authOptions)
      .then(parsedBody => {
        let profileOptions = {
          method: 'POST',
          uri: profileService + "create",
          body: {
              email: req.body.email,
              displayName: req.body.displayName,
              lastName: req.body.lastName || '',
              description: req.body.description || '',
              state: req.body.state || '',
              avatarUrl: req.body.avatarUrl || '',
          },
          json: true // Automatically stringifies the body to JSON
        }
        return rp(profileOptions)
        .then(parsedBody2 => {
          res.status(201);
          res.json({
            message: 'Account created for ' + req.body.email,
            status: 201,
            token: jwt.sign({
              email: req.body.email,
              isTeacher: req.body.isTeacher,
            }, secretKey),
          })
        })
      })
      .catch(errorBody => {
        res.status(errorBody.statusCode);
        res.json({
          status: errorBody.statusCode,
          message: errorBody.error.message,
          form: req.body,
        });
      })
    } else {
      return
    }
  })
});

router.post('/login', (req, res, next) => {
  return loginValidator(req, res)
  .then((result) => {
    if (result) {
      let authOptions = {
        method: 'POST',
        uri: authService + "login",
        body: {
            email: req.body.email,
            password: req.body.password,
        },
        json: true,
      };
      rp(authOptions)
      .then(parsedBody => {
        res.status(200);
        res.json({
          status: 200,
          token: jwt.sign(parsedBody.tokenize, secretKey),
        })
      })
      .catch(errorBody => {
        res.status(errorBody.statusCode);
        res.json({
          status: errorBody.statusCode,
          message: errorBody.error.message,
          form: req.body,
        });
        return;
      })
    }
  })
});

router.post('/deactivate', (req, res, next) => {
  if (req.body.token) {
    jwt.verify(req.body.token, secretKey, function(err, decoded) {
      if (!err) {
        let deactivateOptions = {
          method: 'PUT',
          uri: authService + "deactivate",
          body: {
              email: decoded.email,
          },
          json: true // Automatically stringifies the body to JSON
        };
        let promises = [];
        promises.push(rp(JSON.parse(JSON.stringify(deactivateOptions))));
        deactivateOptions.uri = matchService + "deactivate";
        promises.push(rp(deactivateOptions));
        Promise.all(promises)
        .then(() => {
          res.status(200);
          res.json({
            status: 200,
            message: "Account deactivated",
          });
        })
        .catch(errorBody => {
          res.status(errorBody.statusCode);
          res.json({
            status: errorBody.statusCode,
            message: errorBody.error.message,
          });
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
      message: "Token not sent",
      status: 400,
    })
  }
});

router.post('/activate', (req, res, next) => {
  if (req.body.token) {
    jwt.verify(req.body.token, secretKey, function(err, decoded) {
      if (!err) {
        let activateOptions = {
          method: 'PUT',
          uri: authService + "activate",
          body: {
              email: decoded.email,
          },
          json: true // Automatically stringifies the body to JSON
        };
        let promises = [];
        promises.push(rp(JSON.parse(JSON.stringify(activateOptions))));
        activateOptions.uri = matchService + "deactivate";
        promises.push(rp(activateOptions));
        Promise.all(promises)
        .then(() => {
          res.status(200);
          res.json({
            status: 200,
            message: "Account activated",
          });
        })
        .catch(errorBody => {
          res.status(errorBody.statusCode);
          res.json({
            status: errorBody.statusCode,
            message: errorBody.error.message,
          });
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
      message: "Token not sent",
      status: 400,
    })
  }
})

router.put('/changepassword', (req, res, next) => {
  if (req.body.oldPassword) {
    if (!validatePassword(req.body.oldPassword)) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Passwords must be at least 8 characters and contain at least one uppercase and lowecase letter, one number, and one special character.',
        form: req.body
      })
      return;
    }
  } else {
    res.status(400);
    res.json({
      status: 400,
      message: 'Please enter your old passwords',
      form: req.body,
    })
    return;
  }
  if (req.body.newPassword) {
    if (!validatePassword(req.body.newPassword)) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Passwords must be at least 8 characters and contain at least one uppercase and lowecase letter, one number, and one special character.',
        form: req.body
      })
      return;
    }
  } else {
    res.status(400);
    res.json({
      status: 400,
      message: 'Please enter your new passwords',
      form: req.body,
    })
    return;
  }
  if (req.body.token) {
    jwt.verify(req.body.token, secretKey, function(err, decoded) {
      if (!err) {
        let authOptions = {
          method: 'PUT',
          uri: authService + "update",
          body: {
              email: decoded.email,
              oldPassword: req.body.oldPassword,
              newPassword: req.body.newPassword,
          },
          json: true // Automatically stringifies the body to JSON
        };
        rp(authOptions)
        .then(parsedBody => {
          res.status(200);
          res.json({
            message: 'Password changed for ' + decoded.email,
            status: 200,
          })
        })
        .catch(errorBody => {
          res.status(errorBody.statusCode);
          res.json({
            status: errorBody.statusCode,
            message: errorBody.error.message,
            form: req.body,
          });
        });
      } else {
        res.status(401);
        res.json({
          message: 'Invalid token',
          status: 401,
        })
      }
    });
  } else {
    res.status(401);
    res.json({
      message: 'Please log in',
      status: 401,
    })
  }
});

function validatePassword(password) {
  var capital = false;
  var lower = false;
  var number = false;
  var symbol = false;
  if (password.length < 8) {
    return false;
  }
  capital = password.search(/[A-Z]/g) != -1;
  lower = password.search(/[a-z]/g) != -1;
  number = password.search(/[0-9]/g) != -1;
  symbol = password.search(/[^a-zA-Z0-9]/g) != -1;
  return capital && lower && number && symbol;
}

module.exports = router;
