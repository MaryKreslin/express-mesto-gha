const User = require('../../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: err.message }))
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400).send({ message: "Переданы некорректные данные" })
  }
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(400).send({ message: "Переданы некорректные данные" }))
}

module.exports.getUserOnId = (req, res) => {

  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Запрашиваемый пользователь не найден" })
      }
      res.send({ data: user })
    })
    .catch(err => res.status(400).send({ message: "Переданы некорректные данные" }))
}

module.exports.patchProfile = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(400).send({ message: "Переданы некорректные данные" })
  }
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about })
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "Запрашиваемый пользователь не найден" })
      }
      const newUser = { name: name, about: about, avatar: user.avatar }
      res.send({ data: newUser })
    })
    .catch(err => res.status(400).send({ message: "Переданы некорректные данные" }))
}


module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({ message: "Переданы некорректные данные" })
  }
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "Запрашиваемый пользователь не найден" })
      }
      const newUser = { name: user.name, about: user.about, avatar: avatar }
      res.send({ data: newUser })
    })
    .catch(err => (res.status(500).send({ message: err.message }))
    )
}

