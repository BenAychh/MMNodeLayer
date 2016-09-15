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
    resolve(true)
  })
}
