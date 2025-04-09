// pages/admin/AdminProfile.js
import { Container, Card } from "react-bootstrap";
import { FaUserShield } from "react-icons/fa";

function AdminProfile() {
  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card style={{ width: "22rem" }} className="shadow">
        <Card.Body className="text-center">
          <FaUserShield size={80} className="mb-3 text-primary" />
          <Card.Title className="fw-bold">관리자</Card.Title>
          <Card.Text>
            이름: Admin <br />
            이메일: admin@smartfarm.com
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminProfile;
