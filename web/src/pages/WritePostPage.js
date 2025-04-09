import { Container, Form, Button, Card } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import boardPosts from "./sampleBoardData";

function WritePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // 실제론 서버로 전송하거나 DB에 저장해야 함 (현재는 sampleBoardData.js에 직접 추가)
    const newPost = {
      id: boardPosts.length + 1,
      title,
      content,
      author: "현재로그인유저", // 실제 로그인 사용자 정보로 교체 가능
      createdAt: new Date().toISOString().split("T")[0],
      comments: [],
    };

    boardPosts.unshift(newPost); // 최신글이 위로 가게
    alert("게시글이 등록되었습니다.");
    navigate("/board");
  };

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4 text-success fw-bold">✍️ 게시글 작성</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>제목</Form.Label>
            <Form.Control
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>내용</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="success" type="submit">
              등록하기
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default WritePostPage;
