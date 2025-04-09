import { Container, Row, Col, Card, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "animate.css";

function HomePage() {
  const navigate = useNavigate();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 10); // 애니메이션 지연
  }, []);

  return (
    <>
      {/* 상단 네비게이션 바 */}
      <Navbar bg="light" expand="lg" className="px-3 shadow-sm">
        <Navbar.Brand className="fw-bold text-success" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          🌾 ACG 스마트팜
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={() => navigate("/board")}>게시판</Nav.Link>
            <Nav.Link onClick={() => navigate("/login")}>로그인</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* 메인 콘텐츠 */}
      <Container className={`text-center py-5 ${animated ? "animate__animated animate__fadeIn" : ""}`}>
        <h1 className="fw-bold text-success mb-4 animate__animated animate__fadeInDown">
          🌾 ACG 스마트팜에 오신 것을 환영합니다!
        </h1>

        <p className="lead mb-5 animate__animated animate__fadeInUp animate__delay-1s">
          언제 어디서나 농작물을 스마트하게 관리하세요.  
          실시간 모니터링과 자동화 제어로 더 효율적인 농업을 경험해보세요.
        </p>

        <Row className="mb-5 animate__animated animate__zoomIn animate__delay-2s">
          <Col md={4}>
            <Card className="shadow-lg border-0 h-100">
              <Card.Body>
                <div className="display-4 mb-3">📊</div>
                <Card.Title className="fw-bold text-primary">실시간 데이터</Card.Title>
                <Card.Text>
                  온도, 습도, 토양 수분을 실시간으로 확인할 수 있어요.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-lg border-0 h-100">
              <Card.Body>
                <div className="display-4 mb-3">💡</div>
                <Card.Title className="fw-bold text-warning">자동 제어</Card.Title>
                <Card.Text>
                  조명, 급수 시스템을 원격으로 간편하게 제어할 수 있어요.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-lg border-0 h-100">
              <Card.Body>
                <div className="display-4 mb-3">📱</div>
                <Card.Title className="fw-bold text-success">쉬운 사용</Card.Title>
                <Card.Text>
                  초보자도 쉽게 사용할 수 있는 직관적인 UI를 제공합니다.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default HomePage;
