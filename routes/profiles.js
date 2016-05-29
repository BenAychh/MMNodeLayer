'use strict';
var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var emailValidator = require('email-validator');
var validUrl = require('valid-url');
var jwt = require('jsonwebtoken');

var authService = 'http://localhost:8000/';
var profileService = 'http://localhost:8001/';

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
        res.status(401);
        res.json({
          message: 'Your token appears invalid, please log back in',
          status: 401,
        })
      }
    });
  }
});

module.exports = router;
