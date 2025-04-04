import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function ControlPanel() {
  const [lightStatus, setLightStatus] = useState("off"); // 전구 상태
  const [waterStatus, setWaterStatus] = useState("off"); // 급수 시스템 상태
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지

  // 전구 상태 가져오기
  useEffect(() => {
    fetch("http://localhost:5000/light/status")
      .then((res) => res.json())
      .then((data) => setLightStatus(data.status))
      .catch((err) => console.error("전구 상태 가져오기 실패:", err));
  }, []);

  // 전구 ON/OFF 토글 함수
  const toggleLight = () => {
    setErrorMessage(""); // 에러 메시지 초기화

    fetch("http://localhost:5000/light/toggle", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "on" || data.status === "off") {
          setLightStatus(data.status); // 상태 업데이트
        } else {
          setErrorMessage("⚠️ 전구 상태 변경 실패! 서버와 연결을 확인하세요.");
        }
      })
      .catch(() => setErrorMessage("⚠️ 전구 제어 요청 실패! 네트워크를 확인하세요."));
  };

  // 💧 급수 시스템 ON/OFF 토글 함수 (하드코딩된 데이터 사용)
  const toggleWatering = () => {
    setWaterStatus((prevStatus) => (prevStatus === "on" ? "off" : "on"));
  };

  return (
    <Container className="py-5">
      <h2 className="text-center text-success fw-bold mb-4">🎛 스마트팜 제어 패널</h2>
      <Row className="g-4 justify-content-center">
        {/* 💡 전구 제어 카드 */}
        <Col md={6} lg={4}>
          <Card className="shadow-lg border-0 text-center">
            <Card.Body>
              <h5 className="fw-bold text-primary">💡 조명 제어</h5>
              <div className="display-3 my-3">
                {lightStatus === "on" ? "💡" : "🔅"}
              </div>
              <p className="text-muted">현재 상태: {lightStatus === "on" ? "켜짐" : "꺼짐"}</p>
              <Button
                variant={lightStatus === "on" ? "danger" : "success"}
                className="mt-3 w-100 fw-bold"
                onClick={toggleLight}
              >
                {lightStatus === "on" ? "전구 끄기" : "전구 켜기"}
              </Button>
              {errorMessage && <p className="mt-3 text-danger">{errorMessage}</p>}
            </Card.Body>
          </Card>
        </Col>

        {/* 💧 자동 급수 시스템 카드 */}
        <Col md={6} lg={4}>
          <Card className="shadow-lg border-0 text-center">
            <Card.Body>
              <h5 className="fw-bold text-primary">💧 자동 급수 시스템</h5>
              <div className="display-3 my-3">
                {waterStatus === "on" ? "🚿" : "🌱"}
              </div>
              <p className="text-muted">현재 상태: {waterStatus === "on" ? "작동 중" : "대기 중"}</p>
              <Button
                variant={waterStatus === "on" ? "danger" : "success"}
                className="mt-3 w-100 fw-bold"
                onClick={toggleWatering}
              >
                {waterStatus === "on" ? "급수 중지" : "급수 시작"}
              </Button>
              {/* 🔻 아직 서버와 연결되지 않았음을 표시 */}
              <p className="mt-3 text-danger">⚠️ 아직 서비스 준비중중</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ControlPanel;
