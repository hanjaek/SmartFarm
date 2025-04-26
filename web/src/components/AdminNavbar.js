import { useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../context/PopupContext"; // ✅ 팝업 컨텍스트 추가

function AdminNavbar({ setUserRole }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { showPopup } = usePopup(); // ✅ 모달 제어 함수 가져오기

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
      onConfirm: async () => {
        try {
          // ✅ 서버에 로그아웃 요청 (쿠키 제거)
          await fetch(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
            method: "POST",
            credentials: "include", // 쿠키 포함
          });
        } catch (err) {
          console.error("로그아웃 요청 실패:", err);
        }
  
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
      },
    });
  };

  return (
    <Navbar
      expand="lg"
      bg="dark"
      variant="dark"
      className="shadow"
      expanded={expanded}
    >
      <Container>
        <Navbar.Brand
          onClick={() => handleNavClick("/admin")}
          style={{ cursor: "pointer" }}
        >
          🛠️ SmartFarm Admin
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="admin-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />

        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => handleNavClick("/admin")}>대시보드</Nav.Link>
            <Nav.Link onClick={() => handleNavClick("/admin/users")}>사용자 관리</Nav.Link>
            <Nav.Link onClick={() => handleNavClick("/admin/analytics")}>사용 데이터 분석</Nav.Link>
            <Nav.Link onClick={() => handleNavClick("/admin/monitoring")}>장치 모니터링</Nav.Link>
            <Nav.Link onClick={() => handleNavClick("/admin/eventlogs")}>이벤트 로그</Nav.Link>
            <Nav.Link onClick={() => handleNavClick("/admin/environment")}>환경 설정</Nav.Link>
            <Nav.Link onClick={() => handleNavClick("/admin/security")}>보안 설정</Nav.Link>
            <Nav.Link onClick={() => handleNavClick("/admin/system")}>시스템 설정</Nav.Link>
          </Nav>

          <Nav>
            <NavDropdown title="관리자" id="admin-user-dropdown" align="end">
              <NavDropdown.Item onClick={() => handleNavClick("/admin/profile")}>
                내 프로필
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                로그아웃
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;
