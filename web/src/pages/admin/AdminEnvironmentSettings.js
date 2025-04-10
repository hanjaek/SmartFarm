// src/pages/admin/AdminEnvironmentSettings.js
import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import sampleUsers from "./sampleUserData";

function AdminEnvironmentSettings() {
  const [selectedUserId, setSelectedUserId] = useState(sampleUsers[0].id);
  const [settings, setSettings] = useState(
    sampleUsers[0].environmentSettings
  );

  const handleUserChange = (e) => {
    const userId = parseInt(e.target.value);
    const user = sampleUsers.find((u) => u.id === userId);
    setSelectedUserId(userId);
    setSettings(user.environmentSettings);
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: Number(e.target.value) });
  };

  const handleSave = () => {
    alert("설정이 저장되었습니다.");
    console.log("✅ 저장된 설정:", {
      userId: selectedUserId,
      ...settings,
    });
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">🌿 사용자별 환경 설정</h2>

      <Form.Group className="mb-4">
        <Form.Label>사용자 선택</Form.Label>
        <Form.Select onChange={handleUserChange} value={selectedUserId}>
          {sampleUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.fullName} ({user.username})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>온도 기준 (°C)</Form.Label>
          <Form.Control
            type="number"
            name="temperatureThreshold"
            value={settings.temperatureThreshold}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>습도 기준 (%)</Form.Label>
          <Form.Control
            type="number"
            name="humidityThreshold"
            value={settings.humidityThreshold}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>토양 습도 기준 (%)</Form.Label>
          <Form.Control
            type="number"
            name="soilMoistureThreshold"
            value={settings.soilMoistureThreshold}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="success" onClick={handleSave}>
          저장
        </Button>
      </Form>
    </Container>
  );
}

export default AdminEnvironmentSettings;
