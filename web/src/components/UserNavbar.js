import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { usePopup } from "../context/PopupContext";

function SmartFarmNavbar({ setUserRole }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  const handleNavClick = (path) => {
    setExpanded(false);
    navigate(path);
  };

  const handleLogout = () => {
    setExpanded(false);
    showPopup({
      title: "로그아웃",
      message: "로그아웃 하시겠습니까?",
      buttonText: "로그아웃",
      cancelButtonText: "취소",
      confirmVariant: "success",
      cancelVariant: "danger",
      onConfirm: () => {
        sessionStorage.removeItem("userRole");
        showPopup({
          title: "로그아웃 완료",
          message: "정상적으로 로그아웃되었습니다.",
          buttonText: "확인",
          confirmVariant: "primary",
          onConfirm: () => {
            navigate("/login");
            setTimeout(() => setUserRole(null), 50);
          },
        });
      }
    });
  };

  return (
    <Navbar
      expand="lg"
      bg="success"
      data-bs-theme="dark"
      className="shadow-lg"
      expanded={expanded}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
          🌱 Smart Farm
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={() => handleNavClick("/user/dashboard")} className="text-white">
              🏡 대시보드
            </Nav.Link>
            <Nav.Link onClick={() => handleNavClick("/user/control")} className="text-white">
              🛠 제어 센터
            </Nav.Link>
            <Nav.Link onClick={() => handleNavClick("/user/data")} className="text-white">
              📊 환경 그래프
            </Nav.Link>
            <Nav.Link onClick={() => handleNavClick("/env-settings")} className="text-white">
              🌿 내 농장 설정
            </Nav.Link>
            <Nav.Link onClick={() => handleNavClick("/board")} className="text-white">
              📋 커뮤니티
            </Nav.Link>

            <NavDropdown title="⚙️ 설정" id="settings-nav-dropdown">
              <NavDropdown.Item onClick={() => handleNavClick("/settings")}>
                🔧 앱 설정
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleNavClick("/profile")}>
                👤 내 프로필
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleNavClick("/help")}>
                ❓ 도움말
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                🚪 로그아웃
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SmartFarmNavbar;
