const { GetAllUsers } = require("../controller/controller.auth.js");
const { voidAllRooms } = require("../controller/controller.room.js");
const {
  getAllRooms,
  updateRoomActualUsers,
} = require("../controller/controller.room.js");
const _ = require("lodash");

const { mongo, mongoClose } = require("./mongo");

/**
 * Service permettant de simuler les mouvements des personnes qui entrent et sortent des pièces
 */

let relance = 0;

// Script de remplissage et vidage des gens
const moovementGenerator = async () => {
  relance++;
  // Connection a la bdd
  try {
    await mongo().then(async (mongoose) => {
      console.log("Connected to mongo!!");

      // all users
      const users = await GetAllUsers();

      console.log("\n");
      console.log("Nombres d'utilisateurs ", users.length);
      console.log("\n");

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

        await new Promise((resolve) =>
          setTimeout(resolve, Math.floor(Math.random() * 10000) + 100)
        );

        // faire rentrer un user dans une salles aléatoire
        console.log(
          `${user._id} est sur le point d'entrer dans la salle ${randomRoom.label}`
        );
        const roomFill = await updateRoomActualUsers(req);
        console.log(
          `${user._id} Entre dans la salle ${randomRoom.label} 🚶‍♂️🚪 `
        );
        console.log("\n");

        // attendre entre 30s et 1min
        await new Promise((resolve) =>
          setTimeout(resolve, Math.floor(Math.random() * 30000) + 30000)
        );

        // faire sortir le user de sa salle
        const roomVoid = await updateRoomActualUsers(req);
        console.log(`${user._id} sort de la salle ${randomRoom.label} 🚪🚶‍♂️ `);
        console.log("\n");
        // console.log("roomVoid", roomVoid);

        return roomFill;
      });

      await Promise.all(promise);
    });
  } catch (err) {
    console.error(err);
    return err;
  } finally {
    // close connexion
    await voidAllRooms();
    await mongoClose();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    if (relance < 4) {
      moovementGenerator();
    }
  }
};

moovementGenerator();

// module.exports.moovementGenerator = moovementGenerator;
