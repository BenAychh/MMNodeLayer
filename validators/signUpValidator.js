const Promise = require('bluebird')

module.exports = function signUpValidator(req, res) {
  return new Promise((resolve) => {
    if (req.body.email) {
      if (!emailValidator.validate(req.body.email)) {
        res.status(400);
        res.json({
          status: 400,
          message: 'Please enter a valid email',
          form: req.body,
        })
        resolve(false);
      }
    } else {
      res.status(400);
      res.json({
        status: 400,
        message: 'Please enter an email',
        form: req.body,
      })
      resolve(false);
    }
    if (req.body.password) {
      if (!validatePassword(req.body.password)) {
        res.status(400);
        res.json({
          status: 400,
          message: 'Passwords must be at least 8 characters and contain at least one uppercase and lowecase letter, one number, and one special character.',
          form: req.body
        })
        resolve(false);
      }
    } else {
      res.status(400);
      res.json({
        status: 400,
        message: 'Please enter a password',
        form: req.body,
      })
      resolve(false);
    }
    if (!req.body.displayName) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Please enter a display/first name',
        form: req.body,
      })
      resolve(false);
    }
    if (!isNaN(req.body.displayName)) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Please provide a display name that is text less than 50 characters',
        form: req.body,
      })
      resolve(false);
    }
    if (req.body.displayName.length > 50) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Please provide a display name that is text 50 characters or less',
        form: req.body,
      })
      resolve(false);
    }
    if (req.body.isTeacher == null) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Please select teacher or school',
        form: req.body,
      });
      resolve(false);
    }
    if (req.body.lastName && !req.body.isTeacher) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Schools may not have a last name',
        form: req.body,
      });
      resolve(false);
    }
    if (req.body.lastName && !isNaN(req.body.lastName)) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Please enter a last name that is text and less than 30 characters',
        form: req.body,
      });
      resolve(false);
    }
    if (req.body.lastName && req.body.lastName.length > 30) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Please enter a last name that is text and less than 30 characters',
        form: req.body,
      });
      resolve(false);
    }
    if (req.body.description && !isNaN(req.body.description)) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Please enter a description that is text and less than 500 characters',
        form: req.body,
      });
      resolve(false);
    }
    if (req.body.description && req.body.description.length > 500) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Please enter a description that is text and less than 500 characters',
        form: req.body,
      });
      resolve(false);
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
      resolve(false);
    }
    if (req.body.avatarUrl && !validUrl.isUri(req.body.avatarUrl)) {
      res.status(400);
      res.json({
        status: 400,
        message: 'Please enter a valid url for your profile image',
        form: req.body,
      });
      resolve(false);
    }
    resolve(true)
  })
}
