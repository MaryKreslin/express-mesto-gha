const User = require('../models/user');
const ValidationErr = require('../errors/validationErr');
const NotFoundErr = require('../errors/notFoundErr');
const InternalServerErr = require('../errors/internalServerErr');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.log(err.message);
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      if (!user) {
        return next(new NotFoundErr('Объект не найден'));
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        const err = new ValidationErr('Переданы некорректные данные');
        next(err);
      }
      if (error.name === 'InternalServerError') {
        const err = new InternalServerErr('Ошибка на сервере');
        next(err);
      }
      next(error);
    });
};

module.exports.getUserOnId = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        const error = new NotFoundErr('Пользователь не найден');
        throw error;
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if ((error.name === 'ValidationError') || (error.name === 'CastError')) {
        const err = new ValidationErr('Переданы некорректные данные');
        next(err);
      }
      if (error.name === 'InternalServerError') {
        const err = new InternalServerErr('Ошибка на сервере');
        next(err);
      }
      next(error);
    });
};

module.exports.patchProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        const error = new NotFoundErr('Пользователь не найден');
        throw error;
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if ((error.name === 'ValidationError') || (error.name === 'CastError')) {
        const err = new ValidationErr('Переданы некорректные данные');
        next(err);
      }
      if (error.name === 'InternalServerError') {
        const err = new InternalServerErr('Ошибка на сервере');
        next(err);
      }
      next(error);
    });
};

module.exports.patchAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        const error = new NotFoundErr('Пользователь не найден');
        throw error;
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if ((error.name === 'ValidationError') || (error.name === 'CastError')) {
        const err = new ValidationErr('Переданы некорректные данные');
        next(err);
      }
      if (error.name === 'InternalServerError') {
        const err = new InternalServerErr('Ошибка на сервере');
        next(err);
      }
      next(error);
    });
};
