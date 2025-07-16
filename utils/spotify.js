const axios = require("axios");
const qs = require("qs");

let accessToken = null;

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const data = qs.stringify({ grant_type: "client_credentials" });

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    data,
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  accessToken = response.data.access_token;
  return accessToken;
}

async function searchSongMetadata(title, artist) {
  if (!accessToken) await getAccessToken();

  const query = `track:${title} artist:${artist}`;
  const res = await axios.get(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=1`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (res.data.tracks.items.length === 0) return null;

  const song = res.data.tracks.items[0];
  return {
    album: song.album.name,
    coverImage: song.album.images[0]?.url,
    duration:
      Math.floor(song.duration_ms / 60000) +
      ":" +
      String(Math.floor((song.duration_ms % 60000) / 1000)).padStart(2, "0"),
    spotifyUrl: song.external_urls.spotify,
  };
}

module.exports = { searchSongMetadata };
