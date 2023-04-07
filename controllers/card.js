const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(500).send({ message: err.message }))
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  if (!name || !link) {
    return res.status(400).send({ message: "Переданы некорректные данные" })
  }
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch(err => {
      res.status(500).send({ message: err.message })

    })
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: "Запрашиваемая карточка не найдена" })
      }
      res.send({ message: "Пост удален" })})
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, {
    $addToSet: { likes: req.user._id }
  },
    { new: true })
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: "Запрашиваемая карточка не найдена" })
      }
      res.send({ data: card })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

module.exports.deleteLike = (req, res) => {
    Card.findByIdAndUpdate(req.params.id, {
    $pull: { likes: req.user._id }
  },
    { new: true })
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: "Запрашиваемая карточка не найдена" })
      } res.send({ data: card })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}