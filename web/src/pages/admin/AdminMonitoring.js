import React, { useState } from "react";
import { Container, Card, Row, Col, Badge, Button } from "react-bootstrap";
import sampleUsers from "./sampleUserData";

function AdminMonitoring() {
  const [users, setUsers] = useState(sampleUsers);

  const toggleDevice = (userId, deviceKey) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const currentStatus = user.devices[deviceKey];
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        return {
          ...user,
          devices: {
            ...user.devices,
            [deviceKey]: newStatus
          }
        };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  return (
    <Container className="py-5">
      <h3 className="mb-4">🖥️ 사용자별 장치 모니터링 및 제어</h3>
      <Row>
        {users.map((user) => {
          const recent = user.recentData || {};

          return (
            <Col md={6} lg={4} key={user.id} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>{user.fullName}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    위치: {user.farmLocation}<br />
                    품종: {user.plantType}
                  </Card.Subtitle>
                  <hr />
                  <div className="mb-3">
                    <strong>장치 상태:</strong>
                    <div className="mt-2">
                      {Object.entries(user.devices).map(([device, status]) => (
                        <div key={device} className="d-flex align-items-center justify-content-between mb-2">
                          <Badge
                            bg={status === "ON" ? "success" : "secondary"}
                            className="me-2"
                          >
                            {device}: {status}
                          </Badge>
                          <Button
                            size="sm"
                            variant={status === "ON" ? "outline-danger" : "outline-success"}
                            onClick={() => toggleDevice(user.id, device)}
                          >
                            {status === "ON" ? "OFF로 전환" : "ON으로 전환"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>최근 센서 데이터</strong>
                    <ul className="list-unstyled mt-2">
                      <li>🌡️ 온도: {recent.temperature ?? "-"}℃</li>
                      <li>💧 습도: {recent.humidity ?? "-"}%</li>
                      <li>🌱 토양 습도: {recent.soilMoisture ?? "-"}%</li>
                      <li className="text-muted" style={{ fontSize: "0.9em" }}>
                        ⏱️ {recent.timestamp ?? "-"}
                      </li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default AdminMonitoring;
