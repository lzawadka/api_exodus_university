const User = require('../models/model.user.ts');

exports.addOne = (req, res) => {
  const user = new User({
    ...req.body
  })
  user.save((err, article) => {
    if (err) {
      console.log(err)
    }
  })
}

exports.getOne = (req, res) => {
  User.findById('60f1a86dfba97cb7cbcb65cb')
  .then((user) => {
    console.log(user)
    res.json(user)
    return user
  })
    .catch((err) => {
    console.log(err)
  })
}