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
        const userData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profile_picture: user.profile_picture,
          time: arrayResp[0]._time,
          value: arrayResp[0]._value,
          measurement: arrayResp[0]._measurement,
          nodeID: arrayResp[0].nodeID
        }
        let userWatchResult = [];
        userWatchResult.push(userData)
        console.log(userData, 'userData');
        return res.status(200).send({ success: true, userWatchResult: userWatchResult});
      }
    })
  })
}

exports.GetAllUserRoomWatchData = async (req, res) => {
  let getRoomUsers = await room.getRoomUsers(req, res);
  let queryUsers = "";
  let arrayResp = [];
  if (getRoomUsers.actual_users.length != 0) {
    console.log(getRoomUsers, 'getRoomUsers')
    usersWatch = await getWatchIds(getRoomUsers.actual_users);
    console.log(usersWatch, 'usersWatchId')
  } else {
    return res.status(400).send({ success: false, message: "No user in room, room_id: " +  req.body.room_id});
  }
  let indexUser = 0;

  // Create part of the query
  usersWatch.forEach((users) => {
    indexUser++;
    if(usersWatch.length == indexUser)
      queryUsers += (`r["nodeID"] == "${users.id_sensor}"`)
    else
      queryUsers += (`r["nodeID"] == "${users.id_sensor}" or `)
  })

  const queryGetAllUsersRoomWatchData = `from(bucket: "MarsUniversity")
    |> range(start: -30m)
    |> filter(fn: (r) => ${queryUsers})
    |> filter(fn: (r) => r["_field"] == "data_value")
    |> filter(fn: (r) => r["_measurement"] == "Oxymetre")
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
      let usersWatchData = []
      usersWatch.forEach((user) => {
        var result = arrayResp.find(obj => {
          return obj.nodeID == user.id_sensor
        })
        const userData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profile_picture: user.profile_picture,
          time: result._time,
          value: result._value,
          measurement: result._measurement,
          nodeID: result.nodeID
        }
        usersWatchData.push(userData)
      })
      return res.status(200).send({ success: true, usersWatchResult: usersWatchData });
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
  let allUserWatch = [];
  for (const userId of usersId) {
    const user = await User.findOne({ _id: new ObjectId(userId) })
    allUserWatch.push(user);
  }
  return allUserWatch;
}