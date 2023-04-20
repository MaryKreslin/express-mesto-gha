const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/user');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const NotFoundErr = require('./errors/notFoundErr');
const handleErrors = require('./middlewares/handleErrors');
const { ValidateSignin, ValidateSignup } = require('./middlewares/validateUser');
const { auth } = require('./middlewares/auth');

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

app.post('/signup', ValidateSignup, createUser);
app.post('/signin', ValidateSignin, login);

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
