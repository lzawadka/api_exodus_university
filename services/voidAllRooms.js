// Script qui permet de vider toutes les salles pour les démos et tests

const { voidAllRooms } = require("../controller/controller.room.js");

const { mongo, mongoClose } = require("./mongo");

module.exports = (async () => {
  try {
    await mongo().then(async (mongoose) => {
      await voidAllRooms();
    });
  } catch (error) {
    console.error("error", error);
  } finally {
    await mongoClose();
  }
})();
