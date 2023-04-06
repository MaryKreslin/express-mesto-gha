const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: err.message }))
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err =>res.status(400).send({ message: err.message }))
}

module.exports.getUserOnId = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(404).send({ message: "Запрашиваемый пользователь не найден" }))
}

module.exports.patchProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(400).send({ message: "Запрашиваемый пользователь не найден" }))
}

module.exports.patchAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(400).send({ message: "Запрашиваемый пользователь не найден"}))
}