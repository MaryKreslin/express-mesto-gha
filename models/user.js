const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnauthorizedErr = require('../errors/unauthorizedErr');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i.test(v);
      },
      message: 'Неправильно указан URL'
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
  },
  email: {
    type: String,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неправильно указан адрес почты'
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedErr('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedErr('Неправильные почта или пароль'));
          }
          return user;
        })
    })
}

module.exports = mongoose.model('user', userSchema);
