import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const code = new URLSearchParams(location.search).get("code");
      const redirect_uri = "http://localhost:3000/callback";
      const client_id = "7ef29f13b5de44cc98e618be7588ec41";
      const client_secret = "2507de467a6a437a953d56387423ed4b";

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
  }, []);

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
