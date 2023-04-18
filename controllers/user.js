const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationErr = require('../errors/validationErr');
const NotFoundErr = require('../errors/notFoundErr');
const UnauthorizedErr = require('../errors/unauthorizedErr');
const ConflictErr = require('../errors/conflictErr');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email)) {
    next(new UnauthorizedErr('Неправильные почта или пароль'));
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedErr('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        next(new UnauthorizedErr('Неправильные почта или пароль'));
      }
      const token = jwt.sign({ _id: matched._id }, 'super-secret-key', { expiresIn: '7d' });
      res.send({ token })
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ValidationErr('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.log(err.message);
      next(err);
    });
};

module.exports.getCurentUser = (req, res, next) => {
  console.log(req.user)
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundErr('Пользователь не найден'));
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!validator.isEmail(email)) {
    next(new UnauthorizedErr('Неправильные почта или пароль'));
  }
  User.findOne({ email })
    .then((userFind) => {
      if (!userFind) {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name, about, avatar, email, password: hash,
          }))
          .then((user) => {
            if (!user) {
              next(new NotFoundErr('Объект не найден'));
            }
            return res.send({ data: user });
          });
      } else {
        next(new ConflictErr('Пользователь уже существует!'));
      }
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictErr('Пользователь уже существует!'));
      } else {
        if (error.name === 'ValidationError') {
          next(new ValidationErr('Переданы некорректные данные'));
        } else {
          next(error);
        }
      }
    });
};

module.exports.getUserOnId = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ValidationErr('Переданы некорректные данные'));
      } else {
        next(error);
      }
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
        throw new NotFoundErr('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationErr('Переданы некорректные данные'));
      } else {
        next(error);
      }
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
        throw new NotFoundErr('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationErr('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};
