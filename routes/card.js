const router = require('express').Router();
const {
  getCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/card');

const {ValidateCard} = require ('../middlewares/validateCard');

router.get('/', getCards);

router.post('/', ValidateCard, createCard);

router.delete('/:id', deleteCard);

router.put('/:id/likes', putLike);

router.delete('/:id/likes', deleteLike);

module.exports = router;
