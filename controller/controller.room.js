const Room = require("../models/model.room.js");

exports.addOneRoom = (req, res) => {
  const room = new Room({
    ...req.body,
  });
  room.save((err, article) => {
    if (err) {
      console.log(err);
    }
  });
};
