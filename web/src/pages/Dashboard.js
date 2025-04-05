import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

function Dashboard() {
  return (
    <Container className="py-5">
      <h2 className="text-center text-success fw-bold mb-4">🏡 스마트팜 대시보드</h2>
      <Row className="g-4">
        <Col md={6} lg={4}>
          <Card className="shadow-lg border-0">
            <Card.Body className="text-center">
              <h5 className="fw-bold text-primary">🌡 현재 온도</h5>
              <h2 className="display-4 text-success">25°C</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card className="shadow-lg border-0">
            <Card.Body className="text-center">
              <h5 className="fw-bold text-primary">💧 토양 수분</h5>
              <h2 className="display-4 text-info">습함</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card className="shadow-lg border-0">
            <Card.Body className="text-center">
              <h5 className="fw-bold text-primary">☀️ 일조량</h5>
              <h2 className="display-4 text-warning">80%</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
