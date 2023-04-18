const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/unauthorizedErr');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedErr('Неправильные почта или пароль'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-secret-key');
  } catch (err) {
    next(new UnauthorizedErr('Неправильные почта или пароль'));
  }
  req.user = payload;
  next();
};
