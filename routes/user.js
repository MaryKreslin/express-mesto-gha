const router = require('express').Router();
const {
  getUsers, createUser, getUserOnId, patchProfile, patchAvatar,
} = require('../controllers/user');

router.get('/', getUsers);

router.post('/', createUser);

router.get('/:id', getUserOnId);

router.patch('/me', patchProfile);

router.patch('/me/avatar', patchAvatar);

module.exports = router;
