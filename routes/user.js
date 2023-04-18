const router = require('express').Router();
const {
  getUsers, getUserOnId, patchProfile, patchAvatar, getCurentUser,
} = require('../controllers/user');

router.get('/', getUsers);

router.get('/me', getCurentUser);

router.get('/:id', getUserOnId);

router.patch('/me', patchProfile);

router.patch('/me/avatar', patchAvatar);

module.exports = router;
