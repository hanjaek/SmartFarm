import { Container, Form, Button, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function EditPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [plantTypes, setPlantTypes] = useState([]);  // 품종 목록 상태
  const [selectedPlantType, setSelectedPlantType] = useState("");  // 선택된 품종 상태
  const [images, setImages] = useState([]);  // 업로드된 이미지 상태
  const [post, setPost] = useState(null); // 기존 게시글 데이터 상태
  const navigate = useNavigate();
  const { id } = useParams();  // URL 파라미터에서 postId 가져오기

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/board/posts/${id}`);
        const data = await res.json();
        if (res.ok) {
          setPost(data.post);  // 게시글 데이터 설정
          setTitle(data.post.title);
          setContent(data.post.content);
          setSelectedPlantType(data.post.plant_type);
        } else {
          console.error(data.message || "게시글을 불러오지 못했습니다.");
        }
      } catch (err) {
        console.error("게시글을 불러오는 데 오류가 발생했습니다.", err);
      }
    };

    const fetchPlantTypes = async () => {
      try {
        const res = await fetch(`${BASE_URL}/user/plant-types`, {
          method: "GET",
          credentials: "include", // 인증 토큰을 자동으로 쿠키에 포함
        });
    
        const data = await res.json();
        
        if (res.ok) {
          setPlantTypes(data.plantTypes);  // 품종 목록 설정
        } else {
          console.error(data.message || "품종 목록을 불러오지 못했습니다.");
        }
      } catch (err) {
        console.error("서버 오류로 품종 목록을 불러올 수 없습니다.", err);
      }
    };

    fetchPostData();
    fetchPlantTypes();
  }, [id]);  // id가 변경될 때마다 데이터 새로 고침

  // 파일 업로드 처리
  const handleImageChange = (e) => {
    setImages([...images, ...Array.from(e.target.files)]);  // 파일 목록 상태에 추가
  };

  // 이미지 삽입 처리
  const handleImageInsert = (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));  // 파일들 추가

    fetch(`${BASE_URL}/posts/upload-images`, {
      method: "POST",
      credentials: "include", // 인증 정보 포함
      body: formData,  // FormData 객체 전송
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const uploadedUrls = data.imageUrls;  // 서버에서 반환된 이미지 URL들
          setContent(content + "<img src='" + uploadedUrls[0] + "' alt='Uploaded Image' class='img-fluid' />"); // 텍스트에서 직접 삽입하지 않고 HTML 형식으로 추가
          setImages([]);  // 이미지 선택 초기화
        } else {
          alert("이미지 업로드 실패");
        }
      })
      .catch((err) => {
        console.error("이미지 업로드 오류", err);
        alert("이미지 업로드에 실패했습니다.");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title.trim() && !content.trim() && !selectedPlantType) {
      alert("제목, 내용, 또는 품종을 수정해야 합니다.");
      return;
    }
  
    const data = {
      title,
      content,
      plant_type: selectedPlantType
    };
  
    // 빈 값은 서버로 보내지 않기
    if (!data.title.trim()) delete data.title;
    if (!data.content.trim()) delete data.content;
    if (!data.plant_type) delete data.plant_type;
  
    try {
      const res = await fetch(`${BASE_URL}/board/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"  // JSON 형식으로 데이터를 보낸다고 명시
        },
        credentials: "include", // 인증 정보 포함
        body: JSON.stringify(data),  // 데이터를 JSON.stringify로 변환해서 전송
      });
  
      if (!res.ok) {
        const result = await res.json();
        alert(result.message || "게시글 수정 실패");
        return;
      }
  
      alert("게시글이 수정되었습니다.");
      navigate(`/board/${id}`); // 수정 완료 후 해당 게시글 페이지로 리다이렉트
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      alert("서버 오류로 게시글을 수정할 수 없습니다.");
    }
  };

  if (!post) {
    return <div>게시글을 불러오는 중...</div>; // 게시글이 아직 로딩되지 않았다면 로딩 중 메시지
  }

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4 text-success fw-bold">✍️ 게시글 수정</h4>
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

          {/* 품종 선택 필드 */}
          <Form.Group className="mb-3">
            <Form.Label>품종</Form.Label>
            <Form.Control
              as="select"
              value={selectedPlantType}
              onChange={(e) => setSelectedPlantType(e.target.value)} // 선택된 품종 업데이트
              disabled={plantTypes.length === 0}  // 품종 목록이 없으면 선택 불가
            >
              <option value="">품종을 선택하세요</option>
              {plantTypes.map((plant, index) => (
                <option key={index} value={plant.plantName}>
                  {plant.plantName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* 여러 이미지 업로드 */}
          <Form.Group className="mb-3">
            <Form.Label>이미지 업로드</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple  // 여러 파일 선택 가능
              onChange={handleImageChange} // 파일 선택 시 처리
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleImageInsert}>
              이미지 삽입
            </Button>
          </div>

          {/* 글 내용 */}
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

          {/* 미리보기 영역 */}
          <Card className="mt-4">
            <Card.Body>
              <h5>미리보기</h5>
              <div
                dangerouslySetInnerHTML={{
                  __html: content
                    .replace(
                      /<img /g,
                      '<img style="max-width: 30%; height: auto; display: block; margin: 10px 0;" '
                    )
                    .replace(/\/uploads\//g, `${BASE_URL}/uploads/`)
                }}
              />
            </Card.Body>
          </Card>

          <div className="text-end">
            <Button variant="success" type="submit">
              수정하기
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default EditPostPage;
