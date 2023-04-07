const router = require('express').Router();
const { getCards, createCard, deleteCard, putLike, deleteLike } = require('../controllers/card');

//GET /cards — возвращает все карточки
router.get('/', getCards);
//POST /cards — создаёт карточку
router.post('/', createCard);
//DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete('/:id', deleteCard);

//PUT /cards/:cardId/likes — поставить лайк карточке
router.put('/:id/likes', putLike);
//DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete('/:id/likes', deleteLike);

router.use('/*', (req, res) => {
  res.status(404).send({ message: "Страница не найдена" })
})
module.exports = router;