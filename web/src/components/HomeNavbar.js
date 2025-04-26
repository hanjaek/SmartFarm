import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";  // 아이콘 사용

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
            {/* 로그인 아이콘과 텍스트 */}
            <Nav.Link as={Link} to="/login" className="d-flex align-items-center me-2">
              <FaSignInAlt className="me-2" /> 로그인
            </Nav.Link>
            {/* 회원가입 아이콘과 텍스트 */}
            <Nav.Link as={Link} to="/signup" className="d-flex align-items-center">
              <FaUserPlus className="me-2" /> 회원가입
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HomeNavbar;
