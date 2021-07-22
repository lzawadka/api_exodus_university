/**
 * Script pour remlir une salle jusqu'a ce qu'elle se bloque
 */

const { GetAllUsers } = require("../controller/controller.auth.js");
const {
  getAllRooms,
  updateRoomActualUsers,
} = require("../controller/controller.room.js");
const _ = require("lodash");

const { mongo, mongoClose } = require("./mongo");

// Script de remplissage et vidage des gens
const fillRoom = (async () => {
  // Connection a la bdd
  try {
    await mongo().then(async (mongoose) => {
      console.log("Connected to mongo!!");

      // all users
      const users = await GetAllUsers();

      console.log("user length", users.length);

      // all rooms
      const rooms = await getAllRooms();
      const randomRoom = _.sample(rooms);

      const promise = users.map(async (user) => {
        const req = {
          body: {
            id: randomRoom._id,
            idUser: user._id.toString(),
          },
        };

        await new Promise((resolve) =>
          setTimeout(resolve, Math.floor(Math.random() * 20000) + 100)
        );

        // faire rentrer un user dans une salles aléatoire
        const roomFill = await updateRoomActualUsers(req);
        console.log(`${user._id} Entre dans la salle ${randomRoom.label}`);

        return roomFill;
      });

      await Promise.all(promise);
    });
  } catch (err) {
    console.error(err);
    return err;
  } finally {
    // close connexion
    await mongoClose();
  }
})();

module.exports.fillRoom = fillRoom;
