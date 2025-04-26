import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Modal } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/profile`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('프로필 정보를 불러오지 못했습니다.');

        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleOpenModal = () => {
    if (userInfo) {
      setNickname(userInfo.nickname || '');
      setFarmLocation(userInfo.farm_location || '');
    }
    setError('');
    setCurrentPassword('');
    setNewPassword('');
    setShowModal(true);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {};
    const nicknameChanged = nickname !== userInfo.nickname;
    const locationChanged = farmLocation !== userInfo.farm_location;
    const newPwEntered = newPassword.trim() !== '';
    const currentPwEntered = currentPassword.trim() !== '';

    if (nicknameChanged) payload.nickname = nickname;
    if (locationChanged) payload.farm_location = farmLocation;

    if (newPwEntered && !currentPwEntered) {
      setError('새 비밀번호를 변경하려면 현재 비밀번호를 입력해야 합니다.');
      return;
    }

    if (currentPwEntered && !newPwEntered) {
      setError('비밀번호를 변경하시려면 새 비밀번호를 입력하셔야 합니다.');
      return;
    }

    if (newPwEntered && currentPwEntered) {
      payload.current_password = currentPassword;
      payload.new_password = newPassword;
    }

    if (Object.keys(payload).length === 0) {
      setError('변경된 항목이 없습니다.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || '프로필 수정에 실패했습니다.');
      }

      const updatedProfile = await fetch(`${BASE_URL}/user/profile`, {
        method: 'GET',
        credentials: 'include',
      });

      const updatedData = await updatedProfile.json();
      setUserInfo(updatedData);
      setShowModal(false);
      alert('프로필이 성공적으로 수정되었습니다.');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!userInfo) return <div>로딩 중...</div>;

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card style={{ width: '22rem' }} className="shadow-lg border-0">
        <Card.Body className="text-center">
          <FaUserCircle size={100} className="text-secondary mb-3" />
          <Card.Title className="fw-bold">{userInfo.user_name}</Card.Title>
          <Card.Text className="text-muted">{userInfo.role === 'user' ? '농장 관리자' : '관리자'}</Card.Text>
          <Card.Text>이메일: {userInfo.email}</Card.Text>
          <Card.Text>닉네임: {userInfo.nickname}</Card.Text>
          <Card.Text>농장 위치: {userInfo.farm_location || '정보 없음'}</Card.Text>
          <Button variant="primary" className="mt-3" onClick={handleOpenModal}>
            정보 수정
          </Button>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>프로필 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="text-danger mb-3">{error}</div>}
          <Form onSubmit={handleProfileUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>닉네임</Form.Label>
              <Form.Control
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>농장 위치</Form.Label>
              <Form.Control
                type="text"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>현재 비밀번호</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="새 비밀번호 입력 시에만 필요"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>새 비밀번호 (선택)</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="success" type="submit">
              수정하기
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ProfilePage;
