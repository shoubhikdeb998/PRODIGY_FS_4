const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Access Denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json("Invalid Token");
    req.user = user;
    next();
  });
};

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json("Failed to fetch user");
  }
});

// Follow a user
router.put('/:id/follow', verifyToken, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser.followers.includes(req.user.id)) {
      targetUser.followers.push(req.user.id);
      currentUser.following.push(req.params.id);
      await targetUser.save();
      await currentUser.save();
      res.json("Followed user");
    } else {
      res.status(400).json("Already following");
    }
  } catch (err) {
    res.status(500).json("Follow failed");
  }
});

// Unfollow a user
router.put('/:id/unfollow', verifyToken, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (targetUser.followers.includes(req.user.id)) {
      targetUser.followers = targetUser.followers.filter(
        uid => uid.toString() !== req.user.id
      );
      currentUser.following = currentUser.following.filter(
        uid => uid.toString() !== req.params.id
      );
      await targetUser.save();
      await currentUser.save();
      res.json("Unfollowed user");
    } else {
      res.status(400).json("You're not following this user");
    }
  } catch (err) {
    res.status(500).json("Unfollow failed");
  }
});

// Get any user by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json("User fetch failed");
  }
});


module.exports = router;
