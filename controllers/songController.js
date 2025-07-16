const Song = require("../models/Song");
const { searchSongMetadata } = require("../utils/spotify");

// Step 1: Upload song with basic info (title, artist, file)
const uploadAudio = async (req, res) => {
  try {
    const { title, artist } = req.body;
    if (!req.file)
      return res.status(400).json({ error: "Audio file is required" });

    const fileUrl = `/uploads/${req.file.filename}`;

    const newSong = new Song({
      title,
      artist,
      fileUrl,
      uploadedBy: req.user.id,
    });

    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
};

// Step 2: Manually fetch metadata from Spotify using song ID
const fetchMetadata = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ error: "Song not found" });

    const metadata = await searchSongMetadata(song.title, song.artist);
    if (!metadata)
      return res.status(404).json({ error: "No metadata found on Spotify" });

    song.album = metadata.album;
    song.coverImage = metadata.coverImage;
    song.duration = metadata.duration;
    song.spotifyUrl = metadata.spotifyUrl;

    await song.save();
    res.status(200).json(song);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Metadata fetch failed" });
  }
};

// Step 3: Get all songs (for listing/playing)
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "Failed to load songs" });
  }
};

module.exports = {
  uploadAudio,
  fetchMetadata,
  getAllSongs,
};
