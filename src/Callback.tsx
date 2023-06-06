import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");
      const redirect_uri = encodeURIComponent(
        "https://spoti-fy-lite.vercel.app/callback"
      );
      const client_id = "5ebfa18c14a54b56bc3a400b92d8d15b";
      const client_secret = "c12e735302d54e1c98c3e52e6f64ecb9";

      if (code) {
        const requestData = new URLSearchParams();
        requestData.append("grant_type", "authorization_code");
        requestData.append("code", code);
        requestData.append("redirect_uri", redirect_uri);
        requestData.append("client_id", client_id);
        requestData.append("client_secret", client_secret);

        try {
          const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            requestData.toString(),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          const access_token = response.data.access_token;
          localStorage.setItem("access_token", access_token);

          navigate("/player");
        } catch (error) {
          console.error(
            "Error exchanging authorization code for access token:",
            error
          );
        }
      } else {
        console.error("Authorization code not found in the URL");
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
      <h1 className="text-3xl font-bold text-gray-800">Callback Page</h1>
      <p className="text-gray-800">
        Exchanging authorization code for access token...
      </p>
    </div>
  );
};

export default Callback;
