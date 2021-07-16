const math = require('../services/id_generator')
const { Point, InfluxDB } = require('@influxdata/influxdb-client')

const createDataInflux = () => {
  // You can generate a Token from the "Tokens Tab" in the UI
  const token = 'we-qe81LgT-vs_PauBeeJL7zDfPbAYOX0OpRZYBhLkr0BsGW9pb-o2ABW1rX1UVAOtRKgy7S7F480uB5mLmzVg=='
  const org = 'zawadka78@gmail.com'
  const bucket = 'MarsUniversity'
  
  const client = new InfluxDB({ url: 'https://eu-central-1-1.aws.cloud2.influxdata.com', token: token })
  
  const writeApi = client.getWriteApi(org, bucket)
  writeApi.useDefaultTags({ host: 'host1', location: 'browser' })
  
  // Execute flux query
  const queryApi = client.getQueryApi(org)
  
  function createPointInflux(pointName, prefixId, data)
  {
    const pointInflux = new Point(pointName)
      .tag('id_sensor', prefixId + math())
      .floatField('data', data)
    
    return pointInflux
  }
  
  const temp = createPointInflux('Température', 'temp_', math());
  const oxygene = createPointInflux('Oxygène', 'oxygene', math());
  const pos = createPointInflux('Position', 'pos_', math());
  const occupancy_rate = createPointInflux('Occupancy_Rate', 'occupancy_rate_', math());
  const bpm = createPointInflux('BPM', 'bpm_', math());
  
  const getPosition = `from(bucket: "MarsUniversity")
    |> range(start: -6h)
    |> filter(fn: (r) => r["_measurement"] == "Position")
    |> filter(fn: (r) => r["id_sensor"] == "pos_6151112970")`
  queryApi.queryRows(getPosition, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row)
    },
    error(error) {
      console.error(error)
      console.log('Finished ERROR')
    },
    complete() {
      console.log('Finished SUCCESS')
    }
  })
  
  writeApi.writePoints([temp, oxygene, pos, occupancy_rate, bpm])
  writeApi
      .close()
      .then(() => {
          console.log('FINISHED')
      })
      .catch(e => {
          console.error(e)
          console.log('Finished ERROR')
      })
  
  const query = `from(bucket: "MarsUniversity")
    |> range(start: -6h)
    |> filter(fn: (r) => r["_measurement"] == "Température")
    |> filter(fn: (r) => r["id_sensor"] == "temp_4436276148")`
  queryApi.queryRows(query, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row)
      console.log(
        `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value} where id_sensor = ${o.id_sensor}`
      )
    },
    error(error) {
      console.error(error)
      console.log('Finished ERROR')
    },
    complete() {
      console.log('Finished SUCCESS')
    }
  })
}

createDataInflux();
