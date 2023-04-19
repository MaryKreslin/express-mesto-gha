const { Joi, celebrate } = require('celebrate');

const ValidateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(new RegExp(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/, "i"))
  })
})

const ValidateCardId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex()
  })
})

module.exports = { ValidateCard, ValidateCardId }