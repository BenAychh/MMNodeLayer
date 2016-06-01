'use strict';
var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var emailValidator = require('email-validator');
var validUrl = require('valid-url');
var jwt = require('jsonwebtoken');

var authService = 'http://localhost:8000/'
var profileService = 'http://localhost:8001/'
var matchService = 'http://localhost:8002/'

var secretKey = process.env.secretKey;
if (!secretKey) {
  secretKey = 'shhhhh';
}

router.post('/signup', (req, res, next) => {
  if (req.body.email) {
    if (!emailValidator.validate(req.body.email)) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Please enter a valid email',
        form: req.body,
      })
      return;
    }
  } else {
    res.status(400);
    res.json({
      status: 400,
      message: 'Please enter an email',
      form: req.body,
    })
    return;
  }
  if (req.body.password) {
    if (!validatePassword(req.body.password)) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Passwords must be at least 8 characters and contain at least one uppercase and lowecase letter, one number, and one special character.',
        form: req.body
      })
    }
  } else {
    res.status(400);
    res.json({
      status: 400,
      message: 'Please enter a password',
      form: req.body,
    })
    return;
  }
  if (!req.body.displayName) {
    res.status(400);
    res.json({
      status: 400,
      message: 'Please enter a display/first name',
      form: req.body,
    })
    return;
  }
  if (!isNaN(req.body.displayName)) {
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
      message: 'Please provide a display name that is text 50 characters or less',
      form: req.body,
    })
    return;
  }
  if (req.body.isTeacher == null) {
    res.status(400);
    res.json({
      status: 400,
      message: 'Please select teacher or school',
      form: req.body,
    });
    return;
  }
  if (req.body.lastName && !req.body.isTeacher) {
    res.status(400);
    res.json({
      status: 400,
      message: 'Schools may not have a last name',
      form: req.body,
    });
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
  rp(authOptions)
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
});

router.post('/login', (req, res, next) => {
  if (req.body.email) {
    if (!emailValidator.validate(req.body.email)) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Please enter a valid email',
        form: req.body,
      })
      return;
    }
  } else {
    res.status(400);
    res.json({
      status: 400,
      message: 'Please enter an email',
      form: req.body,
    })
    return;
  }
  if (req.body.password) {
    if (!validatePassword(req.body.password)) {
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
      message: 'Please enter a password',
      form: req.body,
    })
    return;
  }
  let authOptions = {
    method: 'POST',
    uri: authService + "login",
    body: {
        email: req.body.email,
        password: req.body.password,
    },
    json: true,
  };
  console.log(authOptions);
  rp(authOptions)
  .then(parsedBody => {
    res.status(200);
    res.json({
      status: 200,
      token: jwt.sign(parsedBody.tokenize, secretKey),
    })
  })
  .catch(errorBody => {
    console.log(errorBody);
    res.status(errorBody.statusCode);
    res.json({
      status: errorBody.statusCode,
      message: errorBody.error.message,
      form: req.body,
    });
    return;
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
