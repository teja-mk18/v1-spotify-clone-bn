const Liked = require('../models/likedSchema');
const Song = require('../models/Song');

// Like a song
exports.likeSong = async (req, res) => {
  try {
    const userId = req.user._id;
    const songId = req.params.songId;
    let liked = await Liked.findOne({ user: userId });
    if (!liked) {
      liked = await Liked.create({ user: userId, likedSongs: [songId] });
    } else if (!liked.likedSongs.includes(songId)) {
      liked.likedSongs.push(songId);
      await liked.save();
    }
    res.status(200).json({ message: 'Song liked successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unlike a song
exports.unlikeSong = async (req, res) => {
  try {
    const userId = req.user._id;
    const songId = req.params.songId;
    const liked = await Liked.findOne({ user: userId });
    if (liked && liked.likedSongs.includes(songId)) {
      liked.likedSongs = liked.likedSongs.filter(id => id.toString() !== songId);
      await liked.save();
    }
    res.status(200).json({ message: 'Song unliked successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all liked songs
exports.getLikedSongs = async (req, res) => {
  try {
    const userId = req.user._id;
    const liked = await Liked.findOne({ user: userId }).populate('likedSongs');
    res.status(200).json({ likedSongs: liked ? liked.likedSongs : [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 