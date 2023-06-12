import { useState, useRef, useEffect } from "react";
import { searchTracks } from "./spotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStop,
  faSearch,
  faHeadphones,
} from "@fortawesome/free-solid-svg-icons";

const Player = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [songProgress, setSongProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentYear = new Date().getFullYear();

  const handleSearch = async () => {
    if (!searchTerm) return;

    setIsLoading(true);

    const access_token = localStorage.getItem("access_token");

    try {
      const results = await searchTracks(searchTerm, access_token!);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching tracks:", error);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePlay = (trackUrl: string, track: any) => {
    if (!audioRef.current) return;

    if (currentTrack === trackUrl) {
      setIsPlaying(!isPlaying);
      audioRef.current.paused
        ? audioRef.current.play()
        : audioRef.current.pause();
    } else {
      setIsPlaying(true);
      audioRef.current.src = trackUrl;
      audioRef.current.play();
      setCurrentTrack(trackUrl);
      setSelectedTrack(track);
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTrack("");
    setSelectedTrack(null);
  };

  const handleSongEnd = () => {
    setCurrentTrack("");
    setSongProgress(0);
    setRemainingTime(30);
    setSelectedTrack(null);
  };

  const updateProgress = () => {
    if (!audioRef.current || !audioRef.current.duration) return;

    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    const progress = (currentTime / duration) * 100 || 0;
    const remainingSeconds = Math.ceil(30 - currentTime);
    setSongProgress(progress);
    setRemainingTime(remainingSeconds);

    if (currentTime >= 30) {
      handleStop();
    }
  };

  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = offsetX / progressBar.clientWidth;
    const duration = audioRef.current.duration;
    const currentTime = duration * percentage;

    audioRef.current.currentTime = currentTime;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateProgress);
      audioRef.current.addEventListener("ended", handleSongEnd);

      return () => {
        audioRef.current?.removeEventListener("timeupdate", updateProgress);
        audioRef.current?.removeEventListener("ended", handleSongEnd);
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-100">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold mt-8 flex items-center justify-center">
          <FontAwesomeIcon
            icon={faHeadphones}
            className="w-6 h-6 mr-2 text-indigo-500"
            bounce
          />
          JukeBox
        </h1>
        <p className="text-gray-600 mt-2 text-center">
          Discover, explore, and enjoy the latest music.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center mt-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for tracks, artists, or albums..."
              className="px-4 py-2 pr-10 text-gray-800 bg-gray-200 rounded-lg focus:outline-none w-[320px] md:w-96"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 w-[320px] md:w-auto text-white bg-indigo-500 rounded hover:bg-indigo-600 focus:outline-none mt-4 md:mt-0 md:ml-4"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Search"}
          </button>
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1  sm:mx-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
            {searchResults.map((track) => (
              <div
                key={track.id}
                className="py-4 px-4 mx-2 border rounded shadow-lg bg-white transform transition duration-400 hover:scale-110 hover:border-indigo-400 cursor-pointer"
                onClick={() => handlePlay(track.preview_url, track)}
              >
                <div className="flex justify-center mb-2">
                  {track.album?.images?.[0] && (
                    <img
                      src={track.album.images[0].url}
                      alt={track.album.name}
                      className="w-48 h-48 mt-4 object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center items-center">
                  <p className="text-base text-center font-medium">
                    {track.name}
                  </p>
                  <p className="text-gray-600 text-center text-sm">
                    {track.artists?.length > 0
                      ? track.artists
                          .map((artist: any) => artist.name)
                          .join(", ")
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-600">
            No search results found.
          </div>
        )}
        <audio ref={audioRef} />
      </div>

      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-4 shadow-lg flex items-center justify-center">
          <div className="flex items-center w-full sm:w-auto sm:mr-auto">
            {searchResults.map((track) =>
              currentTrack === track.preview_url && selectedTrack === track ? (
                <div className="flex items-center" key={track.id}>
                  <div className="w-16 h-16 sm:w-12 sm:h-12 bg-gray-200 rounded-md">
                    <img
                      src={track.album.images[0].url}
                      alt={track.album.name}
                      className="w-16 h-16 sm:w-12 sm:h-12 rounded-md object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm sm:text-lg text-gray-800 font-medium">
                      {track.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {track.artists && track.artists.length > 0
                        ? track.artists
                            .map((artist: any) => artist.name)
                            .join(", ")
                        : ""}
                    </p>
                  </div>
                </div>
              ) : null
            )}
          </div>
          {currentTrack && (
            <div className="flex flex-col items-center justify-center sm:justify-start ml-4">
              <div className="hidden sm:flex items-center ml-4 w-full sm:w-60 ">
                <div
                  className="flex-grow h-2 bg-gray-200 rounded-2xl cursor-pointer"
                  onClick={handleProgressBarClick}
                >
                  <div
                    className="h-2 bg-indigo-500 rounded-2xl"
                    style={{ width: `${songProgress}%` }}
                  />
                </div>

                <span className="ml-2 text-xs text-gray-600">
                  {remainingTime}s
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    audioRef.current?.paused
                      ? audioRef.current?.play()
                      : audioRef.current?.pause()
                  }
                  className="flex items-center justify-center w-10 h-10 sm:w-20 sm:h-8 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none px-2 py-1 sm:px-4 sm:py-2 transition duration-300 ease-in-out"
                >
                  <FontAwesomeIcon
                    icon={audioRef.current?.paused ? faPlay : faPause}
                    className="text-md sm:mr-1"
                  />
                  <span className="hidden sm:inline">
                    {audioRef.current?.paused ? "Play" : "Pause"}
                  </span>
                </button>
                <button
                  onClick={handleStop}
                  className="flex items-center justify-center w-10 h-10 sm:w-20 sm:h-8 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none px-2 py-1 sm:px-4 sm:py-2 transition duration-300 ease-in-out"
                >
                  <FontAwesomeIcon icon={faStop} className="text-md sm:mr-1" />{" "}
                  <span className="hidden sm:inline">Stop</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <footer className="mx-4 text-xs sm:text-sm lex justify-center items-center text-center text-gray-900 py-4">
        © {currentYear} AbhiVarde - Made with ❤️ for the people of the internet.
      </footer>
    </div>
  );
};

export default Player;
