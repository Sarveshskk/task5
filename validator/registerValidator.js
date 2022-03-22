const { body, validationResult } = require('express-validator')
const dbops = require("../models/index")
const User = dbops.User;
const registerValidateRules = () => {
  return [
    body("first_name").isLength({ min: 3 }).withMessage('first_name must have more than 3 characters'),
    body("last_name").isLength({ min: 2 }).withMessage('last_name must have more than 2 characters'),
    body('email').isEmail().withMessage('Invalid email'),
    body("email").custom(async (value) => {
      let user =await User.findOne({
        where: {
          email: value,
        }
      });
      if (user) {
        throw new Error('email alreday exists');
      }
      return true;
    }),
    body("username").isLength({ min: 3 }).withMessage('username must have more than 3 characters'),
    body("username").custom(async (value) => {
      let user =await User.findOne({
        where: {
          username: value,
        }
      });
      if (user) {
        throw new Error('username alreday exists');
      }
      return true;
    }),

    body("password").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage('password must have 8 character, Upper case, Lower case, and one special character'),
    body("password").custom((value, { req }) => {
      if (value !== req.body.cnfpassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
  ]
}
const registerValidate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  registerValidateRules,
  registerValidate,
}