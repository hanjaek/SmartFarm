import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

function Logout() {
  const handleLogout = () => {
    alert("로그아웃 되었습니다.");
    window.location.href = "/"; // 홈으로 이동
  };

  return (
    <Container className="py-5 text-center">
      <h2 className="text-danger fw-bold">🚪 로그아웃</h2>
      <p className="text-muted">정말 로그아웃하시겠습니까?</p>
      <Button variant="danger" onClick={handleLogout}>로그아웃</Button>
    </Container>
  );
}

export default Logout;
