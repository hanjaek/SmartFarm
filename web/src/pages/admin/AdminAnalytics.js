// src/pages/admin/AdminAnalytics.js
import React, { useState } from "react";
import { Card, Row, Col, Container, Modal, Button } from "react-bootstrap";
import sampleUsers from "./sampleUserData";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";

// Chart.js 등록
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

// 평균 계산 함수
function calculateAverages(sensorData) {
  const total = sensorData.reduce(
    (acc, curr) => ({
      temperature: acc.temperature + curr.temperature,
      humidity: acc.humidity + curr.humidity,
      soilMoisture: acc.soilMoisture + (curr.soilMoisture ?? 0),
    }),
    { temperature: 0, humidity: 0, soilMoisture: 0 }
  );
  const count = sensorData.length;
  return {
    avgTemp: (total.temperature / count).toFixed(1),
    avgHum: (total.humidity / count).toFixed(1),
    avgSoil: (total.soilMoisture / count).toFixed(1),
  };
}

// 사용자 데이터를 품종 기준으로 그룹화
const groupByPlantType = (users) => {
  return users.reduce((acc, user) => {
    const type = user.plantType || "기타";
    if (!acc[type]) acc[type] = [];
    acc[type].push(user);
    return acc;
  }, {});
};

function AdminAnalytics() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const generateChartData = (label, dataKey, color) => {
    return {
      labels: selectedUser.sensorData.map((d) => d.timestamp),
      datasets: [
        {
          label: label,
          data: selectedUser.sensorData.map((d) => d[dataKey]),
          borderColor: color,
          backgroundColor: color.replace("1)", "0.2)"),
          tension: 0.3,
        },
      ],
    };
  };

  const groupedUsers = groupByPlantType(sampleUsers);

  return (
    <Container className="py-5">
      <h3 className="mb-4">📈 품종별 사용자 센서 데이터 분석</h3>

      {Object.entries(groupedUsers).map(([plantType, users]) => (
        <div key={plantType} className="mb-5">
          <h5 className="mb-3">🌿 {plantType} 재배 사용자</h5>
          <Row>
            {users.map((user) => {
              const averages = calculateAverages(user.sensorData);
              return (
                <Col md={6} lg={4} key={user.id} className="mb-4">
                  <Card
                    className="shadow-sm h-100 border-0"
                    onClick={() => handleCardClick(user)}
                    style={{
                      cursor: "pointer",
                      borderRadius: "12px",
                      backgroundColor: "#f9f9f9",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <Card.Body>
                      <Card.Title className="mb-2">
                        <strong>{user.fullName}</strong>{" "}
                        <small className="text-muted">({user.farmLocation})</small>
                      </Card.Title>
                      <Card.Subtitle className="mb-3 text-muted">{user.email}</Card.Subtitle>

                      <div style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                        <div className="mb-2">
                          <strong>📊 일일 평균 센서값</strong>
                        </div>
                        <div>🌡️ 온도: <strong>{averages.avgTemp}℃</strong></div>
                        <div>💧 습도: <strong>{averages.avgHum}%</strong></div>
                        <div>🌱 토양 습도: <strong>{averages.avgSoil}%</strong></div>
                      </div>

                      <div className="mt-3">
                        <small className="text-muted">최근 측정: {user.recentData.timestamp}</small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      ))}

      {/* 그래프 모달 */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>📊 {selectedUser?.fullName}님의 센서 그래프</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <h6>🌡 온도</h6>
              <Line data={generateChartData("온도(℃)", "temperature", "rgba(255,99,132,1)")} />

              <h6 className="mt-4">💧 습도</h6>
              <Line data={generateChartData("습도(%)", "humidity", "rgba(54,162,235,1)")} />

              <h6 className="mt-4">🌱 토양 습도</h6>
              <Line data={generateChartData("토양 습도(%)", "soilMoisture", "rgba(75,192,192,1)")} />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminAnalytics;
