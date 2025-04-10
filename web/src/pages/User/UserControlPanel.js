import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  FaLightbulb,
  FaRegLightbulb,
  FaFan,
  FaSeedling,
  FaShower,
} from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function UserControlPanel() {
  const [lightStatus, setLightStatus] = useState("OFF");
  const [fanStatus, setFanStatus] = useState("OFF");
  const [waterStatus, setWaterStatus] = useState("OFF");

  const [lightErrorMessage, setLightErrorMessage] = useState("");
  const [fanErrorMessage, setFanErrorMessage] = useState("");
  const [waterErrorMessage, setWaterErrorMessage] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/light/status`)
      .then((res) => res.json())
      .then((data) => setLightStatus(data.lightStatus))
      .catch(() => setLightErrorMessage("⚠️ 전구 상태 불러오기 실패"));

    fetch(`${BASE_URL}/fan/status`)
      .then((res) => res.json())
      .then((data) => setFanStatus(data.fanStatus))
      .catch(() => setFanErrorMessage("⚠️ 팬 상태 불러오기 실패"));

    fetch(`${BASE_URL}/watering/status`)
      .then((res) => res.json())
      .then((data) => setWaterStatus(data.wateringStatus))
      .catch(() => setWaterErrorMessage("⚠️ 급수 상태 불러오기 실패"));
  }, []);

  const toggleLight = () => {
    setLightErrorMessage("");
    const newStatus = lightStatus === "ON" ? "OFF" : "ON";

    fetch(`${BASE_URL}/light/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lightStatus: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => setLightStatus(data.lightStatus))
      .catch(() => setLightErrorMessage("⚠️ 전구 제어 실패"));
  };

  const toggleFan = () => {
    setFanErrorMessage("");
    const newStatus = fanStatus === "ON" ? "OFF" : "ON";

    fetch(`${BASE_URL}/fan/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fanStatus: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => setFanStatus(data.fanStatus))
      .catch(() => setFanErrorMessage("⚠️ 팬 제어 실패"));
  };

  const toggleWatering = () => {
    setWaterErrorMessage("");
    const newStatus = waterStatus === "ON" ? "OFF" : "ON";

    fetch(`${BASE_URL}/watering/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wateringStatus: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => setWaterStatus(data.wateringStatus))
      .catch(() => setWaterErrorMessage("⚠️ 급수 제어 실패"));
  };

  return (
    <Container className="py-5">
      <h2 className="text-center text-success fw-bold mb-4">🔧 제어 패널</h2>
      <Row className="g-4">
        {/* 💡 조명 */}
        <Col xs={12} md={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h5 className="fw-bold text-primary">조명 제어</h5>
              <div className="display-5 my-2">
                {lightStatus === "ON" ? (
                  <FaLightbulb className="text-warning" />
                ) : (
                  <FaRegLightbulb style={{ color: "gray" }} />
                )}
              </div>
              <p className="text-muted">
                현재 상태: {lightStatus === "ON" ? "켜짐" : "꺼짐"}
              </p>
              <Button
                variant={lightStatus === "ON" ? "danger" : "success"}
                className="fw-bold w-100"
                onClick={toggleLight}
              >
                {lightStatus === "ON" ? "전구 끄기" : "전구 켜기"}
              </Button>
              {lightErrorMessage && (
                <p className="mt-3 text-danger small">{lightErrorMessage}</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* 💧 급수 */}
        <Col xs={12} md={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h5 className="fw-bold text-primary">자동 급수</h5>
              <div className="display-5 my-2">
                {waterStatus === "ON" ? (
                  <FaShower className="text-info" />
                ) : (
                  <FaSeedling style={{ color: "green" }} />
                )}
              </div>
              <p className="text-muted">
                현재 상태: {waterStatus === "ON" ? "작동 중" : "대기 중"}
              </p>
              <Button
                variant={waterStatus === "ON" ? "danger" : "success"}
                className="fw-bold w-100"
                onClick={toggleWatering}
              >
                {waterStatus === "ON" ? "급수 중지" : "급수 시작"}
              </Button>
              {waterErrorMessage && (
                <p className="mt-3 text-danger small">{waterErrorMessage}</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* 🌬️ 팬 */}
        <Col xs={12} md={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h5 className="fw-bold text-primary">환기팬 제어</h5>
              <div className="display-5 my-2">
                <FaFan
                  style={{
                    color: fanStatus === "ON" ? "#0d6efd" : "gray",
                    transform: fanStatus === "ON" ? "rotate(45deg)" : "none",
                  }}
                />
              </div>
              <p className="text-muted">
                현재 상태: {fanStatus === "ON" ? "켜짐" : "꺼짐"}
              </p>
              <Button
                variant={fanStatus === "ON" ? "danger" : "success"}
                className="fw-bold w-100"
                onClick={toggleFan}
              >
                {fanStatus === "ON" ? "팬 끄기" : "팬 켜기"}
              </Button>
              {fanErrorMessage && (
                <p className="mt-3 text-danger small">{fanErrorMessage}</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserControlPanel;
