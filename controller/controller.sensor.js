const { Point, InfluxDB } = require('@influxdata/influxdb-client')
const { User } = require('../models/model.user.js');
const org = 'zawadka78@gmail.com'
// You can generate a Token from the "Tokens Tab" in the UI
const token = 'we-qe81LgT-vs_PauBeeJL7zDfPbAYOX0OpRZYBhLkr0BsGW9pb-o2ABW1rX1UVAOtRKgy7S7F480uB5mLmzVg=='
const client = new InfluxDB({ url: 'https://eu-central-1-1.aws.cloud2.influxdata.com', token: token })
// Execute flux query
const queryApi = client.getQueryApi(org);

exports.GetUserWatchData = (req, res) => {
  let token = req.cookies['authToken'];
  let arrayResp = [];
  User.findByToken(token, (err, user) => {
    console.log(user.id_sensor);
    if (err) throw err;
    const queryGetPosition = `from(bucket: "MarsUniversity")
      |> range(start: -1h)
      |> filter(fn: (r) => r["id_sensor"] == "${user.id_sensor}") 
      |> sort(columns: ["_time"], desc: true)` // TODO remove watchId by true id
    queryApi.queryRows(queryGetPosition, {
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

exports.GetAllUserWatchData = (req, res) => {
  let token = req.cookies['authToken'];
  let arrayResp = [];
  User.findByToken(token, (err, user) => {
    console.log(user.id_sensor);
    if (err) throw err;
    const queryGetPosition = `from(bucket: "MarsUniversity")
      |> range(start: -1h)
      |> filter(fn: (r) => r["id_sensor"] == "watchID")
      |> sort(columns: ["_time"], desc: true)` 
    queryApi.queryRows(queryGetPosition, {
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

exports.GetRoomData = (req, res) => {
  let arrayResp = [];
  const queryGetPosition = `from(bucket: "MarsUniversity")
    |> range(start: -3h)
    |> filter(fn: (r) => r["nodeID"] == "${req.body.id_room}")
    |> filter(fn: (r) => r["_field"] == "data_value")
    |> filter(fn: (r) => r["_measurement"] == "Luminosity" or r["_measurement"] == "Temperature" or r["_measurement"] == "Oxygen" or r["_measurement"] == "Watts")
    |> sort(columns: ["_time"], desc: true)`
  queryApi.queryRows(queryGetPosition, {
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
  const queryGetPosition = `from(bucket: "MarsUniversity")
    |> range(start: -3h)
    |> filter(fn: (r) => r["_field"] == "data_value")
    |> filter(fn: (r) => r["_measurement"] == "Luminosity" or r["_measurement"] == "Temperature" or r["_measurement"] == "Oxygen" or r["_measurement"] == "Watts")
    |> sort(columns: ["_time"], desc: true)
    |> yield(name: "mean")`
  queryApi.queryRows(queryGetPosition, {
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