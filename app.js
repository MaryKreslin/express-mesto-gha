const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

process.on('uncaughtException', function (err) {
  console.log(err);
});
mongoose.connect('mongodb://127.0.0.1:27017/mestodb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

app.use((req, res, next) => {
  req.user = {
    _id: '642e8b1d324a5e9e6767b972'
  };
  next();
});

app.use('/users', require('./routes/user'))
app.use('/cards', require('./routes/card'))
//app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})