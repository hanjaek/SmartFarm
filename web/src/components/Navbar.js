import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";

function SmartFarmNavbar() {
  return (
    <Navbar expand="lg" bg="success" data-bs-theme="dark" className="shadow-lg">
      <Container>
        {/* 로고 및 홈 버튼 */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
          🌱 Smart Farm
        </Navbar.Brand>

        {/* 모바일 토글 버튼 */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-white">
              🏡 대시보드
            </Nav.Link>
            <Nav.Link as={Link} to="/control" className="text-white">
              🎛 제어
            </Nav.Link>
            <Nav.Link as={Link} to="/data" className="text-white">
              📊 데이터
            </Nav.Link>

            {/* 드롭다운 메뉴 */}
            <NavDropdown title="⚙️ 설정" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/settings">
                🔧 시스템 설정
              </NavDropdown.Item>
              <NavDropdown.Item href="/profile">👤 내 프로필</NavDropdown.Item>
              <NavDropdown.Item href="/help">❓ 도움말</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/logout">🚪 로그아웃</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SmartFarmNavbar;
