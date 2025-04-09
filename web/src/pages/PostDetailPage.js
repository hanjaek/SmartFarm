import { useParams } from "react-router-dom";
import { useState } from "react";
import boardPosts from "./sampleBoardData";
import { Container, Card, Form, Button, ListGroup } from "react-bootstrap";

function PostDetailPage() {
  const { id } = useParams();
  const post = boardPosts.find((p) => p.id === parseInt(id));

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post?.comments || []);

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: comments.length + 1,
      content: comment,
      author: "현재로그인유저",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setComments([...comments, newComment]);
    setComment("");
  };

  if (!post) {
    return (
      <Container className="py-5">
        <h4 className="text-danger">❌ 게시글을 찾을 수 없습니다.</h4>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="fw-bold text-success">{post.title}</h4>
          <p className="text-muted">
            작성자: {post.author}
            {post.plantType && ` · 품종: ${post.plantType}`} · {post.createdAt}
          </p>
          <p>{post.content}</p>
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="fw-bold">💬 댓글</h5>
          {comments.length > 0 ? (
            <ListGroup variant="flush">
              {comments.map((c, i) => (
                <ListGroup.Item key={i}>
                  <strong>{c.author}</strong>: {c.content} <br />
                  <small className="text-muted">📅 {c.createdAt}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted">아직 댓글이 없습니다.</p>
          )}

          <Form className="mt-4">
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력하세요"
              />
            </Form.Group>
            <div className="text-end">
              <Button variant="success" onClick={handleAddComment}>
                댓글 등록
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PostDetailPage;
