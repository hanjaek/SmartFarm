require('dotenv').config()
const { InfluxDB, Point } = require('@influxdata/influxdb-client')

// 환경 변수 설정
const url = process.env.INFLUX_URL
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG
const bucket = process.env.INFLUX_BUCKET

const client = new InfluxDB({ url, token })
const writeApi = client.getWriteApi(org, bucket)
writeApi.useDefaultTags({ device: 'esp32-test' })

// 임의 온도 생성 함수
const generateTemp = () => {
  return parseFloat((Math.random() * 5 + 22).toFixed(1)) // 22~27도
}

let count = 0
const max = 50
const interval = 1000 // 1초 간격

const sendTemperature = () => {
  const temp = generateTemp()
  const point = new Point('temperature')
    .tag('location', 'greenhouse1')
    .floatField('value', temp)

  writeApi.writePoint(point)
  console.log(`[${count + 1}] 온도 전송: ${temp}°C`)

  count++
  if (count < max) {
    setTimeout(sendTemperature, interval)
  } else {
    writeApi
      .close()
      .then(() => console.log('- 50개 전송 완료, 종료!'))
      .catch(e => console.error('- 오류:', e))
  }
}

// 시작
sendTemperature()
