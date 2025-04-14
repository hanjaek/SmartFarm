import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function HomeNavbar() {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-success">
          🌾 ACG 스마트팜
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/board">게시판</Nav.Link>
            <Nav.Link href="#features">서비스 소개</Nav.Link>
          </Nav>
          <Nav>
            <Button as={Link} to="/login" variant="outline-success" className="me-2">
              로그인
            </Button>
            <Button as={Link} to="/signup" variant="success">
              회원가입
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HomeNavbar;
