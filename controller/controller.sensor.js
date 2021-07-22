const { Point, InfluxDB } = require('@influxdata/influxdb-client')
const { User } = require('../models/model.user.js');
const org = 'zawadka78@gmail.com'
const room = require('../controller/controller.room')
// You can generate a Token from the "Tokens Tab" in the UI
const token = 'we-qe81LgT-vs_PauBeeJL7zDfPbAYOX0OpRZYBhLkr0BsGW9pb-o2ABW1rX1UVAOtRKgy7S7F480uB5mLmzVg=='
const client = new InfluxDB({ url: 'https://eu-central-1-1.aws.cloud2.influxdata.com', token: token })
// Execute flux query
const queryApi = client.getQueryApi(org);
const ObjectId = require('mongodb').ObjectId

exports.GetUserWatchData = (req, res) => {
  let token = req.cookies['authToken'];
  let arrayResp = [];
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    const queryGetUserWatchData = `from(bucket: "MarsUniversity")
      |> range(start: -1h)
      |> filter(fn: (r) => r["nodeID"] == "${user.id_sensor}") 
      |> sort(columns: ["_time"], desc: true)` // TODO remove watchId by true id
    queryApi.queryRows(queryGetUserWatchData, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        arrayResp.push(o);
      },
      error(error) {
        console.error(error)
        console.log('Finished ERROR')
      },
      complete() {
        console.log('Finished SUCCESS')
        return res.status(200).send({ success: true, watchValue: arrayResp });
      }
    })
  })
}

exports.GetAllUserRoomWatchData = async (req, res) => {
  let getRoomUsers = await room.getRoomUsers(req, res);
  let queryUsers = "";
  let arrayResp = [];
  let usersWatchId;
  if (getRoomUsers.length != 0){
    usersWatchId = await getWatchIds(getRoomUsers);  
  } else {
    return res.status(400).send({ success: false, message: "No user in room, room_id: " +  req.body.room_id});
  }
  let indexUser = 0;

  // Create part of the query
  usersWatchId.forEach((watch_id) => {
    indexUser++;
    console.log(indexUser)
    if(getRoomUsers.length == indexUser)
      queryUsers += (`r["nodeID"] == "${watch_id}"`)
    else
      queryUsers += (`r["nodeID"] == "${watch_id}" or `)
  })

  const queryGetAllUsersRoomWatchData = `from(bucket: "MarsUniversity")
    |> range(start: -1h)
    |> filter(fn: (r) => ${queryUsers})
    |> sort(columns: ["_time"], desc: true)` 
  queryApi.queryRows(queryGetAllUsersRoomWatchData, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row)
      arrayResp.push(o);
    },
    error(error) {
      console.error(error)
      console.log('Finished ERROR')
    },
    complete() {
      console.log('Finished SUCCESS')
      return res.status(200).send({ success: true, watchValue: arrayResp });
    }
  })
}

exports.GetOneRoomData = (req, res) => {
  let arrayResp = [];
  const queryGetOneRoomData = `from(bucket: "MarsUniversity")
    |> range(start: -3h)
    |> filter(fn: (r) => r["nodeID"] == "${req.body.id_room}")
    |> filter(fn: (r) => r["_field"] == "data_value")
    |> filter(fn: (r) => r["_measurement"] == "Luminosity" or r["_measurement"] == "Temperature" or r["_measurement"] == "Oxygen" or r["_measurement"] == "Watts")
    |> sort(columns: ["_time"], desc: true)`
  queryApi.queryRows(queryGetOneRoomData, {
    next(row, tableMeta) {
      let resp = tableMeta.toObject(row)
      arrayResp.push(resp);
    },
    error(error) {
      console.error(error)
      console.log('Finished ERROR')
    },
    complete() {
      console.log('Finished SUCCESS')
      return res.status(200).send({ success: true, bpmValue: arrayResp });
    }
  })
}

exports.GetAllRoomData = (req, res) => {
  let arrayResp = [];
  const queryGetAllRoomData = `from(bucket: "MarsUniversity")
    |> range(start: -3h)
    |> filter(fn: (r) => r["_field"] == "data_value")
    |> filter(fn: (r) => r["_measurement"] == "Luminosity" or r["_measurement"] == "Temperature" or r["_measurement"] == "Oxygen" or r["_measurement"] == "Watts")
    |> sort(columns: ["_time"], desc: true)
    |> yield(name: "mean")`
  queryApi.queryRows(queryGetAllRoomData, {
    next(row, tableMeta) {
      var resp = tableMeta.toObject(row);
      arrayResp.push(resp)
    },
    error(error) {
      console.error(error)
      console.log('Finished ERROR')
    },
    complete() {
      console.log('Finished SUCCESS')
      res.status(200).send({ success: true, object: arrayResp });
    }
  })
}

async function getWatchIds(usersId) {
  let usersWatchId = [];
  for (const userId of usersId) {
    const user = await User.findOne({ _id: new ObjectId(userId) })
    usersWatchId.push(user.id_sensor);
  }
  return usersWatchId;
}