import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OAuthLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to OAuth login page
    window.location.href = "http://localhost:8080/login"; // Replace 'provider' with your OAuth provider's name
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      setLoading(false); // Set loading to false once the code parameter is detected
      navigate("/home"); // Redirect to Home component
    }
  }, [navigate]);

  return (
    <div>
      {loading ? (
        <div>Redirecting to OAuth login...</div>
      ) : (
        <div>Redirecting to Home...</div>
      )}
    </div>
  );
};

export default OAuthLogin;
