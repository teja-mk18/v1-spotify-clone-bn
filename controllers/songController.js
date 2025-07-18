const Song = require("../models/Song");
const { searchSongMetadata } = require("../utils/spotify");

const uploadAudio = async (req, res) => {
  try {
    const { title, artist } = req.body;
    if (!req.file)
      return res.status(400).json({ error: "Audio file is required" });

    const fileUrl = `/uploads/${req.file.filename}`;

    // Check if the song already exists with metadata
    const existing = await Song.findOne({ title, artist });
    if (
      existing &&
      existing.album &&
      existing.coverImage &&
      existing.duration &&
      existing.spotifyUrl
    ) {
      return res
        .status(200)
        .json({ message: "Song already exists with metadata", song: existing });
    }

    // Fetch metadata from Spotify
    const metadata = await searchSongMetadata(title, artist);

    const newSong = new Song({
      title,
      artist,
      fileUrl,
      uploadedBy: req.user.id,
      album: metadata?.album || null,
      coverImage: metadata?.coverImage || null,
      duration: metadata?.duration || null,
      spotifyUrl: metadata?.spotifyUrl || null,
    });

    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: "Upload failed" });
  }
};

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
  getAllSongs,
};
