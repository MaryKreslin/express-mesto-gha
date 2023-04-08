const User = require('../models/user');
const ValidationErr = require('../errors/validationErr');
const NotFoundErr = require('../errors/notFoundErr');
const InternalServerErr = require('../errors/internalServerErr');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      const ERROR_CODE = 500;
      res.status(ERROR_CODE).send({ message: err.message });
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
        res.status(err.statusCode).send({ message: err.message });
        next(err);
      }
      if (error.name === 'InternalServerError') {
        const err = new InternalServerErr('Ошибка на сервере');
        res.status(err.statusCode).send({ message: err.message });
        next(err);
      }
      next(error);
    });
};

module.exports.getUserOnId = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new NotFoundErr('Пользователь не найден');
      res.status(error.statusCode).send({ message: error.message });
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'InternalServerError') {
        const err = new InternalServerErr('Ошибка на сервере');
        res.status(err.statusCode).send({ message: err.message });
        next(err);
      }
      next(error);
    });
};

module.exports.patchProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about })
    .orFail(() => {
      const error = new NotFoundErr('Пользователь не найден');
      res.status(error.statusCode).send({ message: error.message });
      throw error;
    })
    .then((user) => {
      const newUser = { name, about, avatar: user.avatar };
      res.send({ data: newUser });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        const err = new ValidationErr('Переданы некорректные данные');
        res.status(err.statusCode).send({ message: err.message });
        next(err);
      }
      if (error.name === 'InternalServerError') {
        const err = new InternalServerErr('Ошибка на сервере');
        res.status(err.statusCode).send({ message: err.message });
        next(err);
      }
      next(error);
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    .orFail(() => {
      const error = new NotFoundErr('Пользователь не найден');
      res.status(error.statusCode).send({ message: error.message });
      throw error;
    })
    .then((user) => {
      const newUser = { name: user.name, about: user.about, avatar };
      res.send({ data: newUser });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        const err = new ValidationErr('Переданы некорректные данные');
        res.status(err.statusCode).send({ message: err.message });
        next(err);
      }
      if (error.name === 'InternalServerError') {
        const err = new InternalServerErr('Ошибка на сервере');
        res.status(err.statusCode).send({ message: err.message });
        next(err);
      }
      next(error);
    });
};
