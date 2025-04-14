import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [nickname, setNickname] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          user_name: userName,
          nickname,
          farm_location: farmLocation || null,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMsg("회원가입이 완료되었습니다. 로그인 해주세요.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMsg(data.message || "회원가입 실패");
      }
    } catch {
      setErrorMsg("서버와 연결되지 않았습니다.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-success fw-bold text-center mb-4">🌱 회원가입</h3>

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        <Form onSubmit={handleSignup}>
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

          <Form.Group className="mb-3">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="비밀번호를 입력하세요"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>이름</Form.Label>
            <Form.Control
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder="실명을 입력하세요"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>닉네임</Form.Label>
            <Form.Control
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              placeholder="표시용 닉네임을 입력하세요"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>농장 위치 (선택)</Form.Label>
            <Form.Control
              type="text"
              value={farmLocation}
              onChange={(e) => setFarmLocation(e.target.value)}
              placeholder="예: 전라북도 익산시"
            />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100 mb-2">
            회원가입
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Button variant="outline-secondary" size="sm" onClick={() => navigate("/")}>
            ⬅ 홈으로 돌아가기
          </Button>
        </div>

        <div className="text-center mt-2">
            <span>이미 이메일이 있으신가요? </span>
            <Button variant="link" size="sm" onClick={() => navigate("/login")}>
                로그인
            </Button>
        </div>
      </Card>
    </Container>
  );
}

export default SignupPage;
