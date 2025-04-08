import { Container, ListGroup } from "react-bootstrap";

function EventLogs() {
  const logs = [
    "🌡️ 온도 초과: 하우스 1 (2025-04-03 10:12)",
    "💧 자동급수 작동됨 (2025-04-03 09:55)",
    "⚠️ 라즈베리파이 연결 끊김 (2025-04-03 09:40)",
    "🔌 ESP32 재부팅됨 (2025-04-03 09:10)",
  ];

  return (
    <Container className="py-4">
      <h2 className="mb-4">📋 이벤트 로그</h2>
      <ListGroup>
        {logs.map((log, index) => (
          <ListGroup.Item key={index}>{log}</ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default EventLogs;
