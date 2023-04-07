const User = require('../models/user');
const ValidationError = require('../utils/ValidationError');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: err.message }))
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about) {
    return res.status(400).send({ message: "Переданы некорректные данные" })
  }
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }))
}

module.exports.getUserOnId = (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Запрашиваемый пользователь не найден" })
      }
      res.send({ data: user })
    })
    .catch(err => res.status(500).send({ message: err.message }))
}

module.exports.patchProfile = (req, res) => {
  const { newName, newAbout } = req.body;
  if (!newName || !newAbout) {
    return res.status(400).send({ message: "Переданы некорректные данные" })
  }
  User.findByIdAndUpdate(req.user._id, { name: newName, about: newAbout })
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "Запрашиваемый пользователь не найден" })
      }
      const newUser = { name: newName, about: newAbout, avatar: user.avatar }
      res.send({ data: newUser })
    })
    .catch(err => res.status(500).send({ message: err.message }))
}


module.exports.patchAvatar = (req, res) => {
  const { newAvatar } = req.body;
  if (!newAvatar) {
    return res.status(400).send({ message: "Переданы некорректные данные" })
  }
  User.findByIdAndUpdate(req.user._id, { avatar: newAvatar })
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "Запрашиваемый пользователь не найден" })
      }
      const newUser = { name: user.name, about: user.about, avatar: newAvatar }
      res.send({ data: newUser })
    })
    .catch(err => (res.status(500).send({ message: err.message }))
    )
}

