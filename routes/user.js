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

router.patch('/me/avatar', patchAvatar);

module.exports = router;
