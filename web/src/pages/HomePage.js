import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import "animate.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function HomePage({ setUserRole }) {
  const [animated, setAnimated] = useState(false);

  // ✅ 자동 로그인 체크
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${BASE_URL}/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setUserRole(data.role);       // App.js 상태 업데이트
        }
      } catch (err) {
        console.log("자동 로그인 안 됨");
      }
    };

    checkLogin();
  }, [setUserRole]);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 10);
  }, []);

  return (
    <Container className={`text-center py-5 ${animated ? "animate__animated animate__fadeIn" : ""}`}>
      <h1 className="fw-bold text-success mb-4 animate__animated animate__fadeInDown">
        🌾 ACG 스마트팜에 오신 것을 환영합니다!
      </h1>
      <p className="lead mb-5 animate__animated animate__fadeInUp animate__delay-1s">
        언제 어디서나 농작물을 스마트하게 관리하세요.
        실시간 모니터링과 자동화 제어로 더 효율적인 농업을 경험해보세요.
      </p>

      <Row className="mb-5 animate__animated animate__zoomIn animate__delay-2s">
        {[...Array(3)].map((_, i) => (
          <Col md={4} key={i}>
            <Card className="shadow-lg border-0 h-100">
              <Card.Body>
                <div className="display-4 mb-3">{["📊", "💡", "📱"][i]}</div>
                <Card.Title className="fw-bold text-primary">
                  {["실시간 데이터", "자동 제어", "쉬운 사용"][i]}
                </Card.Title>
                <Card.Text>
                  {
                    [
                      "온도, 습도, 토양 수분을 실시간으로 확인할 수 있어요.",
                      "조명, 급수 시스템을 원격으로 간편하게 제어할 수 있어요.",
                      "초보자도 쉽게 사용할 수 있는 직관적인 UI를 제공합니다.",
                    ][i]
                  }
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default HomePage;
