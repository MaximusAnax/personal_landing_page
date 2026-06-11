const music = require("./music.js");
const site = require("./site.js");

const FALLBACK_COVER = "/images/music/album1.jpg";
const GENERIC_ARTIST_IMAGE = "2a96cbd8b46e442fc41c2b86b821562f";

function pickImage(images) {
  if (!images) return null;
  const list = Array.isArray(images) ? images : [images];
  const preferred = ["extralarge", "large", "medium", "small"];
  for (const size of preferred) {
    const match = list.find((img) => img.size === size);
    const url = match?.["#text"]?.trim();
    if (url) return url;
  }
  const last = list[list.length - 1];
  const url = last?.["#text"]?.trim();
  return url || null;
}

function isGenericArtistImage(url) {
  return url && url.includes(GENERIC_ARTIST_IMAGE);
}

function artistName(artist) {
  if (!artist) return "Unknown";
  if (typeof artist === "string") return artist;
  return artist.name || artist["#text"] || "Unknown";
}

function albumName(album) {
  if (!album) return "";
  if (typeof album === "string") return album;
  return album.name || album["#text"] || "";
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Last.fm request failed (${response.status})`);
  }
  return response.json();
}

function profileUrl() {
  return site.lastfmUsername
    ? `https://www.last.fm/user/${encodeURIComponent(site.lastfmUsername)}/`
    : "https://www.last.fm/";
}

function fallbackData() {
  return {
    topAlbums: music.recentAlbums.map((album) => ({
      title: album.title,
      artist: album.artist,
      coverUrl: album.coverUrl,
      url: profileUrl(),
    })),
    nowPlaying: {
      isLive: false,
      showWave: false,
      label: "Recently Played",
      track: "Connect Last.fm",
      artist: "Set LASTFM_API_KEY and lastfmUsername",
      coverUrl: FALLBACK_COVER,
    },
  };
}

function coverFromTopAlbums(track, topAlbums) {
  const name = albumName(track.album);
  if (!name) return null;

  const match = topAlbums.find(
    (album) => album.title.toLowerCase() === name.toLowerCase()
  );
  return match?.coverUrl || null;
}

function resolveTrackCover(track, topAlbums) {
  const fromTrack = pickImage(track.image);
  if (fromTrack) return fromTrack;

  const fromAlbum = pickImage(track.album?.image);
  if (fromAlbum) return fromAlbum;

  const fromTopAlbums = coverFromTopAlbums(track, topAlbums);
  if (fromTopAlbums) return fromTopAlbums;

  const fromArtist = pickImage(track.artist?.image);
  if (fromArtist && !isGenericArtistImage(fromArtist)) return fromArtist;

  return null;
}

async function fetchTrackCover(artist, trackName, apiKey) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(trackName)}&api_key=${encodeURIComponent(apiKey)}&format=json`;
  const data = await fetchJson(url);
  const track = data?.track;
  if (!track) return null;

  return (
    pickImage(track.album?.image) ||
    pickImage(track.image) ||
    null
  );
}

module.exports = async function () {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = site.lastfmUsername;

  if (!apiKey || !username) {
    return fallbackData();
  }

  const base = "https://ws.audioscrobbler.com/2.0/";
  const albumsUrl = `${base}?method=user.gettopalbums&user=${encodeURIComponent(username)}&period=${encodeURIComponent(site.topAlbumsPeriod)}&limit=${site.topAlbumsLimit}&api_key=${encodeURIComponent(apiKey)}&format=json`;
  const tracksUrl = `${base}?method=user.getrecenttracks&user=${encodeURIComponent(username)}&limit=5&extended=1&api_key=${encodeURIComponent(apiKey)}&format=json`;

  try {
    const [albumsData, tracksData] = await Promise.all([
      fetchJson(albumsUrl),
      fetchJson(tracksUrl),
    ]);

    let albums = albumsData?.topalbums?.album;
    if (albums && !Array.isArray(albums)) albums = [albums];

    const topAlbums = (albums || [])
      .slice(0, site.topAlbumsLimit)
      .map((album) => ({
        title: album.name,
        artist: artistName(album.artist),
        coverUrl: pickImage(album.image) || FALLBACK_COVER,
        url: album.url,
      }));

    let tracks = tracksData?.recenttracks?.track;
    if (tracks && !Array.isArray(tracks)) tracks = [tracks];

    let current = tracks?.find((track) => track["@attr"]?.nowplaying === "true");
    const isLive = Boolean(current);
    if (!current) current = tracks?.[0];

    let nowPlaying = fallbackData().nowPlaying;

    if (current) {
      const artist = artistName(current.artist);
      let coverUrl = resolveTrackCover(current, topAlbums);

      if (!coverUrl) {
        try {
          coverUrl = await fetchTrackCover(artist, current.name, apiKey);
        } catch (error) {
          console.warn("[lastfm] track.getInfo", error.message);
        }
      }

      nowPlaying = {
        isLive,
        showWave: true,
        label: isLive ? "Now Playing" : "Recently Played",
        track: current.name,
        artist,
        coverUrl: coverUrl || FALLBACK_COVER,
      };
    }

    const fallback = fallbackData();
    return {
      topAlbums: topAlbums.length ? topAlbums : fallback.topAlbums,
      nowPlaying,
    };
  } catch (error) {
    console.warn("[lastfm]", error.message);
    return fallbackData();
  }
};
