const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// ✅ Upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage }); // ✅ only one upload

// ✅ JWT verify middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("No token");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json("Invalid token");
    req.user = user;
    next();
  });
};

// ✅ Get all posts
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json("Failed to load posts");
  }
});

// ✅ Like/unlike post
router.put('/:id/like', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
    } else {
      post.likes = post.likes.filter(uid => uid !== req.user.id);
    }
    await post.save();
    res.status(200).json("Updated like status");
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Create post (with image upload)
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  const newPost = new Post({
    userId: req.user.id,
    description: req.body.description,
    image: req.file?.filename || '',
  });
  try {
    await newPost.save();
    res.status(201).json("Post created");
  } catch (err) {
    console.error(err);
    res.status(500).json("Post creation failed");
  }
});

// ✅ Get posts by user ID
router.get('/user/:id', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json(err.message || "Failed to fetch user posts");
  }
});

module.exports = router;
