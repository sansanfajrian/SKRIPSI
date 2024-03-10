import { useEffect } from "react";

const OAUTH_CONFIG = {
  BACKEND_BASE_URL: "http://localhost:8080",
  INIT_URI: "/login/oauth2/google/init",
  REDIRECT_URI: "http://localhost:3001/login/oauth2/google"
}

const OAuthLogin = () => {
  useEffect(() => {
    window.location.href = `${OAUTH_CONFIG.BACKEND_BASE_URL}${OAUTH_CONFIG.INIT_URI}?redirect_uri=${OAUTH_CONFIG.REDIRECT_URI}`;
  }, []);
};

export default OAuthLogin;
