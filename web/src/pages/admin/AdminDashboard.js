import { Container, Row, Col, Card } from "react-bootstrap";
import sampleUserData from "./sampleUserData";

function AdminDashboard() {
  const userCount = sampleUserData.length;

  // 모든 사용자의 장치들을 합쳐서 총 장치 수 계산
  const totalDeviceCount = sampleUserData.reduce((acc, user) => {
    return acc + Object.keys(user.devices).length;
  }, 0);

  // 예시로 최근 알림은 첫 번째 사용자에 대해 조건부 생성
  const recentAlert = sampleUserData.find(user => user.recentData.temperature > user.environmentSettings.temperatureThreshold);
  const recentAlertMessage = recentAlert
    ? `온도 이상 감지 (${recentAlert.fullName})`
    : "최근 알림 없음";

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">📊 어드민 대시보드</h2>
      <Row>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>전체 사용자</Card.Title>
              <Card.Text className="fs-3 fw-bold">{userCount}명</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>활성 장치 수</Card.Title>
              <Card.Text className="fs-3 fw-bold">{totalDeviceCount}대</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>최근 알림</Card.Title>
              <Card.Text className="fs-6 text-muted">{recentAlertMessage}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;
