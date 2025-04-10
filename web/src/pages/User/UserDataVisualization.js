// src/pages/user/UserDataVisualization.js
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
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

function UserDataVisualization() {
  const { sensorData } = userSampleData;

  const labels = sensorData.map((entry) => entry.date);
  const temperatures = sensorData.map((entry) => entry.temperature);
  const humidities = sensorData.map((entry) => entry.humidity);
  const moistures = sensorData.map((entry) => entry.moisture);

  const temperatureChart = {
    labels,
    datasets: [
      {
        label: "온도(°C)",
        data: temperatures,
        borderColor: "rgba(255, 99, 132, 0.8)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const humidityChart = {
    labels,
    datasets: [
      {
        label: "습도(%)",
        data: humidities,
        borderColor: "rgba(54, 162, 235, 0.8)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const moistureChart = {
    labels,
    datasets: [
      {
        label: "토양 수분(%)",
        data: moistures,
        borderColor: "rgba(75, 192, 192, 0.8)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <Container className="py-5">
      <h2 className="text-center text-success fw-bold mb-4">📊 주간 데이터 시각화</h2>

      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="text-danger mb-3">🌡️ 주간 온도 변화</h5>
              <Line data={temperatureChart} height={120} />
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="text-warning mb-3">💧 주간 습도 변화</h5>
              <Line data={humidityChart} height={120} />
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="text-primary mb-3">🌱 주간 토양 수분 변화</h5>
              <Line data={moistureChart} height={120} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserDataVisualization;
