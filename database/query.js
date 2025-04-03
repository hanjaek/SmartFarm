require('dotenv').config()
const { InfluxDB } = require('@influxdata/influxdb-client')

// 환경 변수
const url = process.env.INFLUX_URL
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG
const bucket = process.env.INFLUX_BUCKET

const queryApi = new InfluxDB({ url, token }).getQueryApi(org)

// Flux 쿼리문 (최근 30분 온도 데이터 중 최신 10개 가져오기)
const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: -30m)
  |> filter(fn: (r) => r._measurement == "temperature")
  |> filter(fn: (r) => r._field == "value")
  |> sort(columns: ["_time"], desc: true)
  |> limit(n: 10)
`

queryApi.queryRows(fluxQuery, {
  next(row, tableMeta) {
    const o = tableMeta.toObject(row)
    console.log(`[${o._time}] ${o.device || 'N/A'} → ${o._value}°C`)
  },
  error(error) {
    console.error('❌ 쿼리 오류:', error)
  },
  complete() {
    console.log('✅ 최근 온도 10개 조회 완료!')
  }
})
