const Card = require('../models/card');
const ValidationErr = require('../errors/validationErr');
const NotFoundErr = require('../errors/notFoundErr');
const InternalServerErr = require('../errors/internalServerErr');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        return next(new NotFoundErr('Объект не найден'));
      }
      return res.status(201).send({ data: card });
    })
    .catch((error) => {
      if ((error.name === 'ValidationError') || (error.name === 'CastError')) {
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

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      const error = new NotFoundErr('Объект не найден');
      res.status(error.statusCode).send({ message: error.message });
      throw error;
    })
    .then(() => res.send({ message: 'Пост удален' }))
    .catch((error) => {
      if ((error.name === 'ValidationError') || (error.name === 'CastError')) {
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

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail(() => {
      const error = new NotFoundErr('Объект не найден');
      res.status(error.statusCode).send({ message: error.message });
      throw error;
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((error) => {
      if ((error.name === 'ValidationError') || (error.name === 'CastError')) {
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

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail(() => {
      const error = new NotFoundErr('Объект не найден');
      res.status(error.statusCode).send({ message: error.message });
      throw error;
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((error) => {
      if ((error.name === 'ValidationError') || (error.name === 'CastError')) {
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
