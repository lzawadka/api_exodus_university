const Room = require("../models/model.room.js");

exports.addOneRoom = (req, res) => {
  const room = new Room({
    ...req.body,
  });
  room.save((err, article) => {
    if (err) {
      console.log(err);
    }
    return article;
  });
};

exports.getAllRooms = async (req, res) => {
  const rooms = await Room.find({});
  const roomMap = [];

  rooms.forEach((room) => {
    const obj = {
      _id: room._id,
      label: room.label,
      node_id: room.node_id,
      capacity: room.capacity,
      locked: room.locked,
    };
    roomMap.push(obj);
  });

  if (res) {
    return res.status(200).json({ success: true, roomMap });
  }
  return roomMap;
};

exports.getRoomDetails = async (req, res) => {
  const room = await Room.findOne({ _id: req.params.roomId });
  if (res) {
    return res.status(200).json({ success: true, room });
  }
  return room;
};

exports.getRoomUsers = async (req, res) => {
  const room = await Room.findOne({ _id: req.body.room_id });
  return room;
};

exports.updateRoomLocked = async (req, res) => {
  const filter = { _id: req.params.roomId };
  const room = await Room.findOne(filter);

  const update = { locked: !room.locked };

  let roomUpdate = await Room.findOneAndUpdate(filter, update);

  roomUpdate = await Room.findOne(filter);

  return res.status(200).json({ success: true, room });
};

exports.updateRoomCapacity = async (req, res) => {
  const filter = { _id: req.body.id };
  const update = { capacity: req.body.capacity };

  let room = await Room.findOneAndUpdate(filter, update);

  room = await Room.findOne(filter);

  return res.status(200).json({ success: true, room });
};

exports.voidAllRooms = async (req, res) => {
  const rooms = await exports.getAllRooms();

  const promise = rooms.map(async (room) => {
    const update = { actual_users: [], locked: false };
    roomUpdate = await Room.findOneAndUpdate({ _id: room._id }, update);
  });

  await Promise.all(promise);
  console.log("Salles vidées");
  return;
};

exports.updateRoomActualUsers = async (req, res) => {
  const filter = { _id: req.body.id };
  const _id = req.body.id;
  const idUser = req.body.idUser;

  let room = await Room.findById(_id);

  let roomUpdate = {};
  if (room.actual_users.includes(idUser)) {
    const filterUsers = room.actual_users.filter((id) => id !== idUser);
    const update = { actual_users: filterUsers };
    roomUpdate = await Room.findOneAndUpdate(filter, update);
  } else {
    if (room.locked) {
      const msgLocked = ` ⛔️ La salle ${room._id} est vérouillée, l'user ${idUser} ne peut donc pas y entrer. ⛔️ `;
      console.log(msgLocked);
      return {
        enter: false,
        msgLocked,
      };
    }
    roomUpdate = await Room.findOneAndUpdate(filter, {
      actual_users: [...room.actual_users, idUser],
    });
  }

  room = await Room.findById(_id);

  // vérouiller ou pas le porte si la salle est pleine
  if (room.actual_users.length >= room.capacity) {
    await Room.findOneAndUpdate(filter, {
      locked: true,
    });
  } else {
    await Room.findOneAndUpdate(filter, {
      locked: false,
    });
  }

  roomUpdate = await Room.findOne(filter);
  if (res) {
    return res.status(200).json({ success: true, room });
  }
  return {
    enter: true,
    roomUpdate,
  };
};
