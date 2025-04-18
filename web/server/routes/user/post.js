const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const pool = require('../../db');  // 이미 존재하는 데이터베이스 연결 객체

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));  // 여기만 바꿈
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /^image\/(jpeg|jpg|png|gif)$/.test(file.mimetype);  // ← 이 부분 수정
  
    console.log("Checking file:", file.originalname, file.mimetype);
  
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드할 수 있습니다.'));
    }
  };

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5MB 제한
});
  
// 2. 게시글 수정
  router.put('/board/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, plant_type } = req.body;
    const userId = req.user.userId;
  
    try {
      const postResult = await pool.query('SELECT * FROM board_posts WHERE post_id = $1', [id]);
      if (postResult.rows.length === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const post = postResult.rows[0];
      if (post.user_id !== userId) {
        return res.status(403).json({ message: 'You are not the author of this post' });
      }
  
      // 게시글 수정
      await pool.query(
        'UPDATE board_posts SET title = $1, content = $2, plant_type = $3 WHERE post_id = $4',
        [title, content, plant_type, id]
      );
      res.json({ message: 'Post updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
  // 2. 게시글 삭제
  router.delete('/board/posts/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
      // 게시글의 작성자만 삭제할 수 있도록 체크
      const postResult = await pool.query('SELECT * FROM board_posts WHERE post_id = $1', [id]);
      if (postResult.rows.length === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const post = postResult.rows[0];
      if (post.user_id !== userId) {
        return res.status(403).json({ message: 'You are not the author of this post' });
      }
  
      // 댓글도 함께 삭제
      await pool.query('DELETE FROM board_comments WHERE post_id = $1', [id]);
      await pool.query('DELETE FROM board_posts WHERE post_id = $1', [id]);
      res.json({ message: 'Post deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // 로그인된 사용자 정보 가져오기 (게시글 본인 인증)
  router.get('/board/me', async (req, res) => {
    const userId = req.user.userId;
    try {
      // 'id'를 'user_id'로 수정
      const result = await pool.query('SELECT user_id, nickname FROM users WHERE user_id = $1', [userId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ user: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  } );
  
  // 댓글 추가 API
  router.post("/board/posts/:id/comments", async (req, res) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const { comment } = req.body;
  
      if (!comment.trim()) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      }
  
      const userId = req.user.userId;
  
      if (!userId) {
        return res.status(400).json({ message: "사용자 정보가 없습니다." });
      }
  
      // 댓글 추가
      const result = await client.query(`
        INSERT INTO board_comments (post_id, user_id, comment, commented_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING comment_id, comment, commented_at, user_id
      `, [id, userId, comment]);
  
      // 닉네임 가져오기
      const userResult = await client.query(`
        SELECT nickname FROM users WHERE user_id = $1
      `, [userId]);
  
      const newComment = {
        ...result.rows[0],
        author: userResult.rows[0].nickname  // nickname을 author 키로 함께 반환
      };
  
      res.json({ newComment });
    } catch (err) {
      console.error("댓글 추가 실패:", err);
      res.status(500).json({ message: "서버 오류로 댓글을 추가하지 못했습니다." });
    } finally {
      client.release();
    }
  });
  
  router.post('/posts/upload-images', upload.array('images'), (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: '이미지 파일을 업로드해주세요.' });
    }
  
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);  // 저장된 이미지 URL 리스트
    res.json({ success: true, imageUrls });
  });
  
  // 게시글 작성 API (이미지 업로드 포함)
  router.post("/write/posts", upload.array("images", 5), async (req, res) => {
    const uploadedFiles = req.files;  // 업로드된 파일들
  
    const { title, content, plant_type } = req.body;
  
    if (!title || !content) {
      return res.status(400).json({ message: "제목과 내용을 입력해주세요." });
    }
  
    try {
      // 이미지 URL을 배열로 만들어 게시글에 추가
      const imageUrls = uploadedFiles.map(file => `/uploads/${file.filename}`);
  
      // 게시글 DB에 저장 (이 예시는 실제 DB 저장 부분으로 대체)
      const result = await pool.query(`
        INSERT INTO board_posts (user_id, title, content, plant_type, images)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING post_id, title, content, plant_type, images
      `, [req.user.userId, title, content, plant_type, imageUrls]);
  
      const newPost = result.rows[0];
      res.status(201).json({ newPost });
    } catch (err) {
      console.error("게시글 작성 실패:", err);
      res.status(500).json({ message: "서버 오류로 게시글을 작성하지 못했습니다." });
    }
  });

  module.exports = router;