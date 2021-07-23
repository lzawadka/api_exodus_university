const { addOneRoom } = require("../controller/controller.room.js");

const { mongo } = require("./mongo");

// Nom des salles
const roomsName = [
  {
    label: "salle-syrtis-major",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Fsalle-syrtis-major.jpg?v=1626774480351 ",
    capacity: 10,
    node_id: "951951",
  },
  {
    label: "salle-matara",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Fsalle-matara.jpg?v=1626774480252",
    capacity: 8,
    node_id: "159159",
  },
  {
    label: "salle-amazonis-planitia",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Fsalle-amazonis-planitia.jpg?v=1626774480157",
    capacity: 12,
    node_id: "753753",
  },
  {
    label: "salle-mansae",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Fsalle-mensae.jpg?v=1626774479892",
    capacity: 6,
    node_id: "357357",
  },
  {
    label: "salle-olympus",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Fsalle-olympus.jpg?v=1626774479473",
    capacity: 8,
    node_id: "456456",
  },
  {
    label: "salle-noachis-terra",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Fsalle-noachis-terra.jpg?v=1626774479109",
    capacity: 10,
    node_id: "654654",
  },
  {
    label: "salle-elysium",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Fsalle-elysium.jpg?v=1626774479178",
    capacity: 15,
    node_id: "789789",
  },
  {
    label: "salle-aoelis",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Fsalle-aeolis.jpg?v=1626774479342",
    capacity: 4,
    node_id: "987987",
  },
  {
    label: "salle-des-profs",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Fsalle-des-profs.jpg?v=1626774479227",
    capacity: 10,
    node_id: "123123",
  },
  {
    label: "hall",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Fhall.jpg?v=1626774480010",
    capacity: 20,
    node_id: "321321",
  },
  {
    label: "administration",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Fadministration.jpg?v=1626774479108",
    capacity: 2,
    node_id: "369369",
  },
  {
    label: "toilette h",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Ftoilette-h.jpg?v=1626774479109",
    capacity: 3,
    node_id: "963963",
  },
  {
    label: "toilette f",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Ftoilette-h.jpg?v=1626774479109",
    capacity: 3,
    node_id: "258258",
  },
  {
    label: "infirmerie",
    url: "https://cdn.glitch.com/514a5d2e-054d-4854-9d9c-91abdb7dc4ce%2Finfirmerie.jpg?v=1626774479161",
    capacity: 2,
    node_id: "852852",
  },
];

// creer les salles à la main
module.exports = (async () => {
  await mongo().then(async (mongoose) => {
    console.log("Connected to mongo!!");
    const promise = roomsName.map(async (room) => {
      const req = {
        body: {
          label: room.label,
          actual_users: [],
          sensor_ids: [],
          node_id: room.node_id,
          img_url: room.url,
          locked: false,
          capacity: room.capacity,
        },
      };

      return addOneRoom(req);
    });

    await Promise.all(promise);
    console.log(`Les salles ont bien été crées`);
  });
})();
