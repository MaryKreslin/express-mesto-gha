const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/user');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const NotFoundErr = require('./errors/notFoundErr');
const handleErrors = require('./middlewares/handleErrors');
const { auth } = require('./middlewares/auth')

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

process.on('uncaughtException', (err) => {
  console.log(err);
});
mongoose.connect(
  'mongodb://127.0.0.1:27017/mestodb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
  .then(() => console.log('Database connected!'))
  .catch((err) => console.log(err));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  })
}),
  createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  })
}),
  login);

//app.use(auth);

app.use('/users', auth, userRouter);

app.use('/cards', auth, cardRouter);

app.use(errors());

app.use('*', (req, res, next) => {
  const err = new NotFoundErr('Страница не найдена');
  next(err);
});

app.use(handleErrors);

app.listen(PORT, (err) => {
  if (err) {
    console.log('Error while starting server');
  } else {
    console.log(`App listening on port ${PORT}`);
  }
});
