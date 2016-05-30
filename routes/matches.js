'use strict';
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var rp = require('request-promise');
var matchService = 'http://localhost:8002/';

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

module.exports = router;
