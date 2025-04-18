import { useParams, useNavigate } from "react-router-dom"; // useHistory -> useNavigate로 변경
import { useState, useEffect } from "react";
import { Container, Card, Form, Button, ListGroup, Spinner } from "react-bootstrap";
import moment from "moment";
import "moment/locale/ko";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null); // 로그인된 사용자 정보
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${BASE_URL}/board/me`, {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user); // 로그인된 사용자 정보
    };
  
    const fetchPostDetail = async () => {
      try {
        const res = await fetch(`${BASE_URL}/board/posts/${id}`);
        const data = await res.json();
        setPost(data.post);
        setComments(data.comments || []);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };
  
    fetchUser();
    fetchPostDetail();
  }, [id]);
  
  const handleAddComment = async () => {
    if (!comment.trim()) return;

    const newComment = {
      comment,
    };

    try {
      const res = await fetch(`${BASE_URL}/board/posts/${id}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      const result = await res.json();
      setComments([...comments, result.newComment]);
      setComment("");
    } catch (err) {
      console.error("댓글 등록 실패:", err);
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("정말로 게시글을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const res = await fetch(`${BASE_URL}/board/posts/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.ok) {
          alert("게시글이 삭제되었습니다.");
          navigate("/board"); // 게시글 목록으로 리다이렉트
        } else {
          alert("게시글 삭제에 실패했습니다.");
        }
      } catch (err) {
        console.error("게시글 삭제 실패:", err);
      }
    }
  };

  const handleEditPost = () => {
    navigate(`/edit/post/${id}`); // 수정 페이지로 리다이렉트
  };

  const formatCommentTime = (time) => {
    const now = moment();
    const posted = moment(time);
    const diffMins = now.diff(posted, "minutes");
    const diffHours = now.diff(posted, "hours");

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24 && now.isSame(posted, "day")) {
      return `오늘 ${posted.format("A h:mm")}`;
    }
    if (now.subtract(1, "day").isSame(posted, "day")) {
      return `어제 ${posted.format("A h:mm")}`;
    }
    return posted.format("YYYY.MM.DD HH:mm");
  };

  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="success" />
        <span className="ms-3">로딩 중...</span>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="py-5">
        <h4 className="text-danger">❌ 게시글을 찾을 수 없습니다.</h4>
      </Container>
    );
  }

  const isAuthor = user && user.user_id === post.user_id; // 현재 사용자와 게시글 작성자가 동일한지 확인

  return (
    <Container className="py-5">
      <Card className="mb-4 shadow-sm" style={{ position: "relative" }}>
        <Card.Body>
        <h4 className="fw-bold text-dark">{post.title}</h4>
          <p className="text-muted">
            작성자: {post.author}
            {post.plant_type && ` · 품종: ${post.plant_type}`}
          </p>
          <p
            className="created-at"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "0.85rem",
              color: "#888",
            }}
          >
            작성일: {new Date(post.created_at).toLocaleDateString("ko-KR")}
          </p>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(
                  /<img /g,
                  '<img style="max-width: 30%; height: auto;" '
                )
                .replace(
                  /\/uploads\//g,
                  `${BASE_URL}/uploads/`
                )
                .replace(/\n/g, "<br>")
            }}
          />
          {isAuthor && (
            <div
              className="mt-3"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                display: "flex",
                gap: "10px",
              }}
            >
              <Button variant="primary" onClick={handleEditPost}>
                수정
              </Button>
              <Button
                variant="danger"
                onClick={handleDeletePost}
              >
                삭제
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="fw-bold">💬 댓글</h5>
          {comments.length > 0 ? (
            <ListGroup variant="flush">
              {comments.map((c, i) => (
                <ListGroup.Item key={i}>
                  <strong>{c.author}</strong>: {c.comment} <br />
                  <small className="text-muted">
                    📅 {formatCommentTime(c.commented_at)}
                  </small>
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
