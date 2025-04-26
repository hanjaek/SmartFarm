// src/pages/admin/AdminUserList.js
import React, { useState } from "react";
import {Table,Container,Modal,Button, Form,Card,Row,Col,} from "react-bootstrap";
import sampleUsers from "./sampleUserData";

function AdminUserList() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditedEmail("");
    setEditedPassword("");
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log("변경된 이메일:", editedEmail || selectedUser.email);
    console.log("변경된 비밀번호:", editedPassword || selectedUser.password);
    setIsEditing(false);
    setShowModal(false);
  };

  // 검색 필터 적용
  const filteredUsers = sampleUsers.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  return (
    <Container className="py-5">
      <h3>👥 사용자 목록</h3>

      {/* 🔍 검색 입력창 */}
      <Form className="mb-4 mt-3">
        <Form.Control
          type="text"
          placeholder="이름 또는 이메일로 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form>

      {/* 💻 데스크탑용 테이블 */}
      <div className="d-none d-lg-block">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>이름</th>
              <th>이메일</th>
              <th>지역</th>
              <th>품종</th>
              <th>연결된 장치</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user)}
                style={{ cursor: "pointer" }}
              >
                <td>{idx + 1}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.farmLocation}</td>
                <td>{user.plantType}</td>
                <td>{Object.keys(user.devices).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* 📱 모바일용 카드뷰 */}
      <div className="d-lg-none">
        <Row>
          {filteredUsers.map((user, idx) => (
            <Col xs={12} key={user.id} className="mb-3">
              <Card
                onClick={() => handleRowClick(user)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <Card.Title>
                    #{idx + 1} - {user.fullName}
                  </Card.Title>
                  <Card.Text>
                    <strong>이메일:</strong> {user.email} <br />
                    <strong>지역:</strong> {user.farmLocation} <br />
                    <strong>품종:</strong> {user.plantType} <br />
                    <strong>연결된 장치:</strong>{" "}
                    {Object.keys(user.devices).join(", ")}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 모달: 사용자 정보 확인 및 수정 */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>사용자 정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && !isEditing && (
            <>
              <p>
                <strong>이메일:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>비밀번호:</strong> {selectedUser.password}
              </p>
            </>
          )}

          {isEditing && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>새 이메일</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="새 이메일 입력"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>새 비밀번호</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="새 비밀번호 입력"
                  value={editedPassword}
                  onChange={(e) => setEditedPassword(e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
          {!isEditing ? (
            <Button variant="primary" onClick={handleEdit}>
              변경
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSave}>
              저장
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminUserList;
