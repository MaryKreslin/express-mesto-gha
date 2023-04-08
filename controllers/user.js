const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      const ERROR_CODE = 500;
      res.status(ERROR_CODE).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      const ERROR_CODE = 400;
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
    });
};

module.exports.getUserOnId = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch(() => {
      const ERROR_CODE = 400;
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
    });
};

module.exports.patchProfile = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    const ERROR_CODE = 400;
    return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
  }
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about })
    .then((user) => {
      if (!user) {
        const ERROR_CODE = 404;
        return res.status(ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      const newUser = { name, about, avatar: user.avatar };
      return res.send({ data: newUser });
    })
    .catch(() => {
      const ERROR_CODE = 400;
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    const ERROR_CODE = 400;
    return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
  }
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    .then((user) => {
      if (!user) {
        const ERROR_CODE = 404;
        return res.status(ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      const newUser = { name: user.name, about: user.about, avatar };
      return res.send({ data: newUser });
    })
    .catch(() => {
      const ERROR_CODE = 400;
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
    });
};
