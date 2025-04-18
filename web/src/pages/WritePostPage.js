import { Container, Form, Button, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function WritePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [plantTypes, setPlantTypes] = useState([]);
  const [selectedPlantType, setSelectedPlantType] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlantTypes = async () => {
      try {
        const res = await fetch(`${BASE_URL}/user/plant-types`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setPlantTypes(data.plantTypes);
        } else {
          console.error(data.message || "품종 목록을 불러오지 못했습니다.");
        }
      } catch (err) {
        console.error("서버 오류로 품종 목록을 불러올 수 없습니다.", err);
      }
    };
    fetchPlantTypes();
  }, []);

  const handleImageChange = (e) => {
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const handleImageInsert = (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));

    fetch(`${BASE_URL}/posts/upload-images`, {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const uploadedUrls = data.imageUrls;
          const imgTags = uploadedUrls.map(
            (url) =>
              `<img src="${url}" alt="Uploaded Image" style="max-width: 100%; margin-bottom: 10px;" />`
          );
          setContent((prev) => prev + imgTags.join(""));
          setImages([]);
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
    if (!title.trim() || !content.trim() || !selectedPlantType) {
      alert("제목, 내용, 그리고 품종을 모두 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("plant_type", selectedPlantType);

    try {
      const res = await fetch(`${BASE_URL}/write/posts`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        alert("게시글이 등록되었습니다.");
        navigate("/board");
      } else {
        alert(result.message || "게시글 등록 실패");
      }
    } catch (err) {
      console.error("게시글 등록 실패:", err);
      alert("서버 오류로 게시글을 등록할 수 없습니다.");
    }
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

          <Form.Group className="mb-3">
            <Form.Label>품종</Form.Label>
            <Form.Control
              as="select"
              value={selectedPlantType}
              onChange={(e) => setSelectedPlantType(e.target.value)}
              disabled={plantTypes.length === 0}
            >
              <option value="">품종을 선택하세요</option>
              {plantTypes.map((plant, index) => (
                <option key={index} value={plant.plantName}>
                  {plant.plantName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>이미지 업로드</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleImageInsert}>
              이미지 삽입
            </Button>
          </div>

          <Form.Group className="mb-4 mt-3">
            <Form.Label>내용</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>

          {/* ✅ 실시간 HTML 미리보기 */}
          <div className="mb-4">
  <Form.Label>미리보기</Form.Label>
  <div
    className="border rounded p-3"
    style={{ minHeight: "150px", backgroundColor: "#f8f9fa" }}
    dangerouslySetInnerHTML={{
      __html: content
        .replace(
          /<img /g,
          '<img style="max-width: 30%; height: auto; display: block; margin: 10px 0;" '
        )
        .replace(/\/uploads\//g, `${BASE_URL}/uploads/`)
        .replace(/\n/g, "<br>")
    }}
  />
</div>

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
