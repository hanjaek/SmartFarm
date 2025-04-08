import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container className="text-center py-5">
      <h1 className="display-1 text-danger">404</h1>
      <p className="lead text-muted mb-4">페이지를 찾을 수 없습니다 😥</p>
      <Button variant="primary" onClick={() => navigate("/")}>
        홈으로 돌아가기
      </Button>
    </Container>
  );
}

export default NotFoundPage;
