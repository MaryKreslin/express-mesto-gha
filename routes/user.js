const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserOnId, patchProfile, patchAvatar, getCurentUser,
} = require('../controllers/user');

router.get('/', getUsers);

router.get('/me', getCurentUser);

router.get('/:id', getUserOnId);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
}),
  patchProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
    .pattern(new RegExp('https?:\/\/(www)?[0-9a-z\-._~:/?#[]@!$&\'\(\)*+,;=[]+#?$')),
  }),
}),
  patchAvatar);

module.exports = router;
