import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FaUserCircle } from "react-icons/fa"; // 사람 아이콘

function Profile() {
  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card style={{ width: "22rem" }} className="shadow-lg border-0">
        <Card.Body className="text-center">
          {/* 사람 아이콘 */}
          <FaUserCircle size={100} className="text-secondary mb-3" />
          <Card.Title className="fw-bold">홍길동</Card.Title>
          <Card.Text className="text-muted">농장 관리자</Card.Text>
          <Button variant="primary" className="mt-3">정보 수정</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;
