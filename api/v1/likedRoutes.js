const express = require('express');
const router = express.Router();
const { likeSong, unlikeSong, getLikedSongs } = require('../../controllers/likedController');
const { userAuthenticationMiddleware } = require('./middleware');

// Like a song
router.post('/like/:songId', userAuthenticationMiddleware, likeSong);

// Unlike a song
router.post('/unlike/:songId', userAuthenticationMiddleware, unlikeSong);

// Get all liked songs
router.get('/songs', userAuthenticationMiddleware, getLikedSongs);

module.exports = router; 