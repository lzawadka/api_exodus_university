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
      // all users
      const users = await GetAllUsers();

      console.log("\n");
      console.log("Nombres d'utilisateurs", users.length);

      // all rooms
      const rooms = await getAllRooms();
      const randomRoom = _.sample(rooms);

      console.log("\n");
      console.log(
        `Les utilisateurs entrent dans la salle ${randomRoom.label} qui a une capacité de ${randomRoom.capacity} places.`
      );
      console.log("\n");

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
        console.log("\n");
        console.log(
          `${user._id} est sur le point d'entrer dans la salle ${randomRoom.label}`
        );

        const roomFill = await updateRoomActualUsers(req);
        if (roomFill.enter) {
          console.log(
            `${user._id} est entré dans la salle ${randomRoom.label}  🚶‍♂️🚪 `
          );
          console.log("\n");
        }

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
