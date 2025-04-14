import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { usePopup } from "../context/PopupContext";

function UserNavbar({ setUserRole }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  const handleNavClick = (path) => {
    setExpanded(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setExpanded(false);
    showPopup({
      title: "로그아웃",
      message: "로그아웃 하시겠습니까?",
      buttonText: "로그아웃",
      cancelButtonText: "취소",
      confirmVariant: "success",
      cancelVariant: "danger",
      onConfirm: async () => {
        try {
          await fetch(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
            method: "POST",
            credentials: "include", // ✅ 쿠키 포함해서 보내야 함
          });
  
          sessionStorage.removeItem("userRole"); // 필요하면 유지 or 제거
          setUserRole(null); // 상태 초기화
  
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
        } catch (err) {
          showPopup({
            title: "에러",
            message: "서버와 연결되지 않았습니다.",
            buttonText: "확인",
            confirmVariant: "danger",
          });
        }
      },
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

export default UserNavbar;
