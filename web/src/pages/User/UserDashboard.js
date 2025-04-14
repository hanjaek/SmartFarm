import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function UserDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/user/dashboard`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch dashboard data");

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("대시보드 데이터 가져오기 실패:", err);
      }
    };

    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  const sensorLogs = data.sensorLogs || [];
  const dailySensorLogs = data.dailySensorLogs || [];

  // 현재값 (최근 센서 데이터 기준)
  const latest = sensorLogs.at(-1) || {};
  const temperature = latest.temperature;
  const humidity = latest.humidity;
  const moisture = latest.soil_moisture;

  // 1시간 단위 평균값 그래프용 데이터
  const labels = dailySensorLogs.map(item =>
    new Date(item.time).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit"
    })
  );

  const temperatureData = dailySensorLogs.map(item => item.temperature);
  const humidityData = dailySensorLogs.map(item => item.humidity);
  const moistureData = dailySensorLogs.map(item => item.soil_moisture);

  const chartConfig = (label, data, color) => ({
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: color.border,
        backgroundColor: color.background,
        tension: 0.4,
        fill: true,
      },
    ],
  });

  return (
    <Container className="py-5">
      <h2 className="text-center fw-bold text-success mb-4">🌿 사용자 대시보드</h2>

      {/* 작물 정보 */}
      {(data.crop || data.plantedAt) && (
        <Row className="mb-4">
          <Col>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h5 className="fw-bold text-primary">🪴 내 작물 정보</h5>
                {data.crop && <p>품종: <strong>{data.crop}</strong></p>}
                {data.plantedAt && (
                  <p>
                    심은 날짜:{" "}
                    <strong>
                      {new Date(data.plantedAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </strong>
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {(temperature || humidity || moisture) && (
        <Row className="g-4 mb-4">
          {temperature !== undefined && (
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-primary">🌡️ 현재 온도</h6>
                  <h2 className="text-danger">{temperature}°C</h2>
                </Card.Body>
              </Card>
            </Col>
          )}
          {humidity !== undefined && (
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-primary">💧 현재 습도</h6>
                  <h2 className="text-primary">{humidity}%</h2>
                </Card.Body>
              </Card>
            </Col>
          )}
          {moisture !== undefined && (
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-primary">🌱 토양 수분</h6>
                  <h2 className="text-info">{moisture}%</h2>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      )}

      {/* 하루치 평균 그래프 */}
      {dailySensorLogs.length > 0 && (
        <Row className="mb-4">
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6 className="text-success">📈 온도 변화</h6>
                <Line
                  data={chartConfig("온도(°C)", temperatureData, {
                    border: "rgba(255, 99, 132, 0.8)",
                    background: "rgba(255, 99, 132, 0.2)",
                  })}
                  height={150}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6 className="text-warning">💦 습도 변화</h6>
                <Line
                  data={chartConfig("습도(%)", humidityData, {
                    border: "rgba(54, 162, 235, 0.8)",
                    background: "rgba(54, 162, 235, 0.2)",
                  })}
                  height={150}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6 className="text-primary">🌱 토양 수분 변화</h6>
                <Line
                  data={chartConfig("토양 수분(%)", moistureData, {
                    border: "rgba(75, 192, 192, 0.8)",
                    background: "rgba(75, 192, 192, 0.2)",
                  })}
                  height={150}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* 장치 상태 */}
      {Array.isArray(data.devices) && data.devices.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h5 className="text-dark fw-bold">🔧 장치 상태</h5>
                {data.devices.map((device) => (
                  <p key={device.id}>
                    {device.type === "lighting" && "💡 조명"}
                    {device.type === "watering" && "💦 급수 시스템"}
                    {device.type === "fan" && "🌬 팬"}:{" "}
                    <strong>{device.status ? "ON" : "OFF"}</strong>
                  </p>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default UserDashboard;
