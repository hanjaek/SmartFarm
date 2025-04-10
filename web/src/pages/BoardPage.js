import { useState } from "react";
import { Link } from "react-router-dom";
import boardPosts from "./sampleBoardData";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function BoardPage() {
  const [searchCategory, setSearchCategory] = useState("title");
  const [searchText, setSearchText] = useState("");

  const filteredPosts = boardPosts.filter((post) => {
    const value = post[searchCategory];
    return (
      value &&
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <Container className="py-5">
      <h2 className="fw-bold text-success mb-4">📋 스마트팜 커뮤니티 게시판</h2>

      {/* 🔍 검색 바 */}
      <Form className="d-flex gap-2 mb-4">
        <Form.Select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          style={{ maxWidth: "140px" }}
        >
          <option value="title">제목</option>
          <option value="author">작성자</option>
          <option value="plantType">품종</option>
        </Form.Select>

        <Form.Control
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Form>

      {/* ✅ 게시글 목록 */}
      {filteredPosts.length > 0 &&
        filteredPosts.map((post) => (
          <Card key={post.id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold">{post.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                ✍ {post.author} | 📅 {post.createdAt}
              </Card.Subtitle>
              <Link
                to={`/board/${post.id}`}
                className="btn btn-outline-success btn-sm mt-2"
              >
                자세히 보기
              </Link>
            </Card.Body>
          </Card>
        ))}

      {/* 글쓰기 버튼 */}
      <div className="text-end mt-4">
        <Link to="/board/write">
          <Button variant="success">✏️ 글쓰기</Button>
        </Link>
      </div>
    </Container>
  );
}

export default BoardPage;
