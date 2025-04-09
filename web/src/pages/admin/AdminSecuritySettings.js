import { Container, Form, Button } from "react-bootstrap";

function SecuritySettings() {
  return (
    <Container className="py-4">
      <h2 className="mb-4">🔒 보안 설정</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>비밀번호 변경</Form.Label>
          <Form.Control type="password" placeholder="새 비밀번호 입력" />
        </Form.Group>
        <Button variant="danger">변경</Button>
      </Form>
    </Container>
  );
}

export default SecuritySettings;
