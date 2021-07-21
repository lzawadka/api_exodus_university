const { GetAllUsers } = require("../controller/controller.auth.js");
const {
  getAllRooms,
  updateRoomActualUsers,
} = require("../controller/controller.room.js");
const _ = require("lodash");

const { mongo, mongoClose } = require("./mongo");

/**
 * Service permettant de simuler les mouvements des personnes qui entrent et sortent des pièces
 */

// Script de remplissage et vidage des gens
module.exports = (async () => {
  // Connection a la bdd
  try {
    await mongo().then(async (mongoose) => {
      console.log("Connected to mongo!!");

      // all users
      const users = await GetAllUsers();

      console.log("user length", users.length);

      // all rooms
      const rooms = await getAllRooms();

      const promise = users.map(async (user) => {
        const randomRoom = _.sample(rooms);
        const req = {
          body: {
            id: randomRoom._id,
            idUser: user._id.toString(),
          },
        };

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // faire rentrer un user dans une salles aléatoire
        const roomFill = await updateRoomActualUsers(req);
        console.log("roomFill", roomFill);

        // attendre entre 30s et 1min
        await new Promise((resolve) =>
          setTimeout(resolve, Math.floor(Math.random() * 30000) + 30000)
        );
        console.log(`${user._id} sort de la salle ${randomRoom.label}`);

        // faire sortir le user de sa salle
        const roomVoid = await updateRoomActualUsers(req);
        console.log("roomVoid", roomVoid);

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
