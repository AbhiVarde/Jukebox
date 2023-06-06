import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadphones,
  faArrowRightToBracket,
} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const handleLogin = () => {
    const client_id = "5ebfa18c14a54b56bc3a400b92d8d15b";
    const scope = "user-read-private user-read-email";
    const redirect_uri = encodeURIComponent(
      "https://spoti-fy-lite.vercel.app/callback"
    );

    window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${encodeURIComponent(
      scope
    )}&response_type=code`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg">
        <h1 className="flex items-center justify-center text-3xl text-center font-bold text-gray-800">
          <FontAwesomeIcon
            icon={faHeadphones}
            className="mr-3 text-indigo-500"
            bounce
          />
          SpotiFy Lite
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Unleash your music journey with SpotiFy Lite.
        </p>
        <button
          className="w-full justify-center px-4 py-2 mt-6 text-white bg-indigo-500 rounded hover:bg-indigo-600 flex items-center"
          onClick={handleLogin}
        >
          Log in with Spotify{" "}
          <FontAwesomeIcon
            icon={faArrowRightToBracket}
            className="ml-2 text-lg"
          />
        </button>
      </div>
      <footer className="mx-auto fixed bottom-0 text-gray-900 py-4">
        © 2023 AbhiVarde - Made with ❤️ for the people of the internet.
      </footer>
    </div>
  );
};

export default Login;
