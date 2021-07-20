const { addOneRoom } = require("../controller/controller.room.js");

const { mongo, mongoClose } = require("./mongo");

/**
 * Service permettant de simuler les mouvements des personnes qui entrent et sortent des pièces
 */

// Nom des salles
const roomsName = [
  {
    label: "Salle Olympus",
    url: "https://images.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
  },
  {
    label: "Salle Matara",
    url: "https://images.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
  },
  {
    label: "Salle Elysium",
    url: "https://images.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
  },
  {
    label: "Salle Syrtis Major",
    url: "https://images.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
  },
  {
    label: "Toilette H",
    url: "https://images.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
  },
  {
    label: "Toilette F",
    url: "https://imags.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
  },
  {
    label: "Salles des profs",
    url: "https://images.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
  },
  {
    label: "Administration",
    url: "https://images.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
  },
  {
    label: "Hall",
    url: "https://images.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
  },
  {
    label: "Salle Amazonis Platinia",
    url: "https://images.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
  },
  {
    label: "Salle Noachis Terra",
    url: "https://images.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
  },
  {
    label: "Salle Aeolis",
    url: "https://images.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
  },
  {
    label: "Salle Mensae",
    url: "https://images.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
  },
];

// creer les salles à la main
const createRooms = async () => {
  await mongo().then(async (mongoose) => {
    console.log("Connected to mongo!!");
    const promise = roomsName.map(async (room) => {
      const req = {
        body: {
          label: room.label,
          actual_users: [],
          sensor_ids: [],
          node_id: "000000",
          img_url: room.url,
          locked: false,
          capacity: 50,
        },
      };

      return addOneRoom(req);
    });

    await Promise.all(promise);
    console.log(`Les salles ont bien été crées`);
  });
};

// createRooms();

// Script de remplissage et vidage des gens
module.exports = (async () => {
  // Connection a la bdd
  try {
    await mongo().then(async (mongoose) => {
      console.log("Connected to mongo!!");
    });
  } catch (err) {
    console.error(err);
    return err;
  } finally {
    // close connexion
    await mongoClose();
  }
})();
