// src/pages/user/UserDashboard.js
import React from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import userSampleData from "./UserSampleData";

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

function UserDashboard() {
  const {
    crop,
    growthStage,
    expectedHarvest,
    alerts,
    deviceStatus,
    todayData,
  } = userSampleData;

  const temperature = todayData?.temperature?.slice(-1)[0] ?? "N/A";
  const humidity = todayData?.humidity?.slice(-1)[0] ?? "N/A";
  const moisture = todayData?.moisture?.slice(-1)[0] ?? "N/A";

  const temperatureChart = {
    labels: todayData?.labels ?? [],
    datasets: [
      {
        label: "온도(°C)",
        data: todayData?.temperature ?? [],
        borderColor: "rgba(255, 99, 132, 0.8)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const humidityChart = {
    labels: todayData?.labels ?? [],
    datasets: [
      {
        label: "습도(%)",
        data: todayData?.humidity ?? [],
        borderColor: "rgba(54, 162, 235, 0.8)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const moistureChart = {
    labels: todayData?.labels ?? [],
    datasets: [
      {
        label: "토양 수분(%)",
        data: todayData?.moisture ?? [],
        borderColor: "rgba(75, 192, 192, 0.8)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <Container className="py-5">
      <h2 className="text-center fw-bold text-success mb-4">🌿 사용자 대시보드</h2>

      {/* 작물 정보 */}
      <Row className="mb-4">
        <Col>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5 className="fw-bold text-primary">🪴 내 작물 정보</h5>
              <p>품종: <strong>{crop}</strong></p>
              <p>성장 단계: <strong>{growthStage}</strong></p>
              <p>예상 수확일: <strong>{expectedHarvest}</strong></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 현재 센서 값 */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-primary">🌡️ 현재 온도</h6>
              <h2 className="text-success">{temperature}°C</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-primary">💧 현재 습도</h6>
              <h2 className="text-warning">{humidity}%</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-primary">🌱 토양 수분</h6>
              <h2 className="text-info">{moisture}%</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 센서 변화 그래프 */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6 className="text-success">📈 온도 변화</h6>
              <Line data={temperatureChart} height={150} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6 className="text-warning">💦 습도 변화</h6>
              <Line data={humidityChart} height={150} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6 className="text-primary">🌱 토양 수분 변화</h6>
              <Line data={moistureChart} height={150} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 장치 상태 */}
      <Row className="mb-4">
        <Col>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5 className="text-dark fw-bold">🔧 장치 상태</h5>
              <p>💡 조명: <strong>{deviceStatus.light}</strong></p>
              <p>💦 급수 시스템: <strong>{deviceStatus.water}</strong></p>
              <p>🌬 팬: <strong>{deviceStatus.fan}</strong></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 알림 */}
      {alerts?.length > 0 && (
        <Row>
          <Col>
            <Card className="shadow-sm border-danger">
              <Card.Body>
                <h6 className="text-danger fw-bold">🔔 알림</h6>
                <ul className="mb-0">
                  {alerts.map((msg, idx) => (
                    <li key={idx}>
                      <Badge bg="danger" className="me-2">경고</Badge>
                      {msg}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default UserDashboard;
