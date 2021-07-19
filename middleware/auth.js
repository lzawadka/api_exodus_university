const { User } = require('../models/model.user.js');
const auth = (req, res, next) => {
  let token = req.headers.authorization.slice(7);
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true })
    req.token = token
    req.user = user;
    next();
  });
}
module.exports = { auth }