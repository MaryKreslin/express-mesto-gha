const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      const ERROR_CODE = 500;
      res.status(ERROR_CODE).send({ message: err.message });
    });
};

module.exports.createCard = (req, res) => {
  try {
    const { name, link } = req.body;
    Card.create({ name, link, owner: req.user._id })
      .then((card) => res.status(201).send({ data: card }))
      .catch(() => {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      });
  } catch (err) {
    const ERROR_CODE = 500;
    res.status(ERROR_CODE).send({ message: err.message });
  }
};

module.exports.deleteCard = (req, res) => {
  try {
    Card.findByIdAndRemove(req.params.id)
      .then((card) => {
        if (!card) {
          const ERROR_CODE = 404;
          return res.status(ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
        }
        return res.send({ message: 'Пост удален' });
      })
      .catch(() => {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      });
  } catch (err) {
    const ERROR_CODE = 500;
    res.status(ERROR_CODE).send({ message: err.message });
  }
};

module.exports.putLike = (req, res) => {
  try {
    Card.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        }
        return res.send({ data: card });
      })
      .catch(() => {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      });
  } catch (err) {
    const ERROR_CODE = 500;
    res.status(ERROR_CODE).send({ message: err.message });
  }
};

module.exports.deleteLike = (req, res) => {
  try {
    Card.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        }
        return res.send({ data: card });
      })
      .catch(() => {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      });
  } catch (err) {
    const ERROR_CODE = 500;
    res.status(ERROR_CODE).send({ message: err.message });
  }
};
