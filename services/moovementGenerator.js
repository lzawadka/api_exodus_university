const { addOneRoom } = require("../controller/controller.room.js");

/**
 * Service permettant de simuler les mouvements des personnes qui entrent et sortent des pièces
 */

// creer les salles à la main
const createRooms = () => {
  // Nom des salles
  const roomsName = [
    "Salle Olympus",
    "Salle Matara",
    "Salle Elysium",
    "Salle Syrtis Major",
    "Toilette H",
    "Toilette F",
    "Infirmerie",
    "Salles des profs",
    "Administration",
    "Hall",
    "Salle Amazonis Platinia",
    "Salle Noachis Terra",
    "Salle Aeolis",
    "Salle Mensae",
  ];

  roomsName.forEach(async (room) => {
    const req = {
      body: {
        label: room,
        actual_users: [],
        sensor_ids: [],
        node_id: "000000",
        img_url:
          "https://images.unsplash.com/photo-1528701202755-cf9158dc3da6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1939&q=80",
        locked: false,
        capacity: 50,
      },
    };

    const res = await addOneRoom(req);
    console.log(`La salle ${room} à bien été créer` + res);
  });
};

createRooms();
