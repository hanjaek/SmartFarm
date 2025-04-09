import React, { useState } from "react";
import { Container, Form, Button, Card, Row, Col, Alert } from "react-bootstrap";

function UserEnvironmentSettings() {
  const [inputValues, setInputValues] = useState({
    temperature: 25,
    humidity: 60,
    soilMoisture: 40,
  });

  const [plantType, setPlantType] = useState("상추");
  const [savedSettings, setSavedSettings] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handlePlantChange = (e) => {
    setPlantType(e.target.value);
  };

  const handleSave = () => {
    setSavedSettings({ ...inputValues, plantType });
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">⚙️ 환경 기준 설정</h2>

      {savedSettings && (
        <Alert variant="info" className="text-center">
          ✅ 현재 기준 설정:
          온도 <strong>{savedSettings.temperature}℃</strong> /
          습도 <strong>{savedSettings.humidity}%</strong> /
          토양 습도 <strong>{savedSettings.soilMoisture}%</strong> /
          품종 <strong>{savedSettings.plantType}</strong>
        </Alert>
      )}

      <Card className="p-4 shadow-sm">
        <Form>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>📌 품종 선택</Form.Label>
                <Form.Select value={plantType} onChange={handlePlantChange}>
                  <option value="상추">상추</option>
                  <option value="청경채">청경채</option>
                  <option value="허브">허브</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>🌡️ 온도 기준 (°C)</Form.Label>
                <Form.Control
                  type="number"
                  name="temperature"
                  value={inputValues.temperature}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>💧 습도 기준 (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="humidity"
                  value={inputValues.humidity}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>🌱 토양 습도 기준 (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="soilMoisture"
                  value={inputValues.soilMoisture}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button variant="success" onClick={handleSave}>
              저장하기
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default UserEnvironmentSettings;
