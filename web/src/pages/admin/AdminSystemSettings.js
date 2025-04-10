import { Container, Card } from "react-bootstrap";

function AdminSystemSettings() {
  return (
    <Container className="py-4">
      <h2 className="fw-bold">⚙️ 시스템 설정</h2>
      <Card className="p-3">
        <p>버전: SmartFarm v1.0.0</p>
        <p>마지막 업데이트: 2025-04-01</p>
        <p>MQTT 브로커 상태: ✅ 연결됨</p>
      </Card>
    </Container>
  );
}
export default AdminSystemSettings;
