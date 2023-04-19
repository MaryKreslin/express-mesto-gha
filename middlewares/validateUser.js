const { Joi, celebrate } = require('celebrate');

const ValidateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/, "i"))
  })
})

const ValidateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  })
})

const ValidateUserId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex()
  })
})

const ValidateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
})

const ValidateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/, "i"))
  })
})
module.exports = { ValidateSignin, ValidateSignup, ValidateUserId ,ValidateProfile, ValidateAvatar };