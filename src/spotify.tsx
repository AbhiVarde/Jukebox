import axios from "axios";

const API_BASE_URL = "https://api.spotify.com/v1";

export async function searchTracks(searchTerm: string, accessToken: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        q: searchTerm,
        type: "track",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { tracks } = response.data;

    const playableTracks = tracks.items
      .filter((track: any) => track.preview_url)
      .map((track: any) => {
        return {
          ...track,
          preview_url: `${track.preview_url}?duration_ms=60000`,
        };
      });

    return playableTracks;
  } catch (error) {
    console.error("Error searching tracks:", error);
    throw error;
  }
}
