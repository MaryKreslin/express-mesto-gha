const router = require('express').Router();
const { getUsers, createUser, getUserOnId, patchProfile, patchAvatar } = require('../controllers/user');

//GET /users — возвращает всех пользователей
router.get('/', getUsers);

//POST /users — создаёт пользователя
router.post('/', createUser);

//GET /users/:userId - возвращает пользователя по _id
router.get('/:id', getUserOnId);

//PATCH /users/me — обновляет профиль
router.patch('/me', patchProfile);

//PATCH /users/me/avatar — обновляет аватар
router.patch('/me/avatar', patchAvatar);

module.exports = router;
