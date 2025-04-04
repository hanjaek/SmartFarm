require('dotenv').config()
const { InfluxDB } = require('@influxdata/influxdb-client')

const url = process.env.INFLUX_URL
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG
const bucket = process.env.INFLUX_BUCKET

const queryApi = new InfluxDB({ url, token }).getQueryApi(org)

const fluxQuery = `
import "influxdata/influxdb/schema"

latest = from(bucket: "${bucket}")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "temperature")
  |> filter(fn: (r) => r._field == "value")
  |> sort(columns: ["_time"], desc: true)
  |> limit(n: 10)

avg = from(bucket: "${bucket}")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "temperature")
  |> filter(fn: (r) => r._field == "value")
  |> mean()

union(tables: [latest, avg])
`

let average = null

queryApi.queryRows(fluxQuery, {
  next(row, tableMeta) {
    const o = tableMeta.toObject(row)

    if (o._time) {
      console.log(`[${o._time}] ${o.device || 'N/A'} → ${o._value}°C`)
    } else {
      average = o._value
    }
  },
  error(error) {
    console.error('- 쿼리 오류:', error)
  },
  complete() {
    if (average !== null) {
      console.log(`\n------------- 평균 온도: ${average.toFixed(2)}°C---------------\n`)
    }
    console.log('최근 온도 10개와 평균 온도 조회 완료!\n')
  }
})
