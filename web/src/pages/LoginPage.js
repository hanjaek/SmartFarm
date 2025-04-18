import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function LoginPage({ setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 여부 확인
    const checkLogin = async () => {
      try {
        const res = await fetch(`${BASE_URL}/me`, {
          method: "GET",
          credentials: "include", // 쿠키 포함
        });
        const data = await res.json();
        if (data.success) {
          setUserRole(data.role);
          navigate(data.role === "admin" ? "/admin" : "/user");
        }
      } catch (err) {
        console.log("자동 로그인 실패");
      }
    };
    checkLogin();
  }, [navigate, setUserRole]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 쿠키 포함
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUserRole(data.role);
        navigate(data.role === "admin" ? "/admin" : "/user");
      } else {
        setErrorMsg(data.message || "로그인 실패");
      }
    } catch (error) {
      setErrorMsg("서버와 연결되지 않았습니다.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-success fw-bold text-center mb-4">🌿 로그인</h3>

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="이메일을 입력하세요"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="비밀번호를 입력하세요"
            />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100 mb-2">
            로그인
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Button variant="outline-secondary" size="sm" onClick={() => navigate("/")}>
            ⬅ 홈으로 돌아가기
          </Button>
        </div>

        <div className="text-center mt-2">
            <span>이메일이 존재하지 않으신가요? </span>
            <Button variant="link" size="sm" onClick={() => navigate("/signup")}>
                회원가입
            </Button>
        </div>
      </Card>
    </Container>
  );
}

export default LoginPage;
