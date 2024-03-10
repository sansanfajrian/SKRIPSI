import { Axios } from "axios";
import { useEffect } from "react";
import { useSearchParams } from 'react-router-dom';

const OAUTH_CONFIG = {
  BACKEND_BASE_URL: "http://localhost:8080",
  CODE_URI: "/login/oauth2/google/code",
  REDIRECT_URI: "http://localhost:3000/login/oauth2/google"
}

const OAuthLogin = () => {
  let [qp] = useSearchParams();

  useEffect(() => {
    const { state, code } = {
      state: qp.get("state"),
      code: qp.get("code")
    }
    const controller = new AbortController();
    if(state && code){
      new Axios({
        baseURL: OAUTH_CONFIG.BACKEND_BASE_URL,
        headers: {
          "Content-Type": 'application/json'
        }
      }).post(OAUTH_CONFIG.CODE_URI, JSON.stringify({
        state, code,
        redirect_uri: OAUTH_CONFIG.REDIRECT_URI
      }), { signal: controller.signal }).then((res) => {
        console.log(res)
      }).catch((err)=>{
        console.log(err);
      });
    }
    return () => {
      controller.abort()
    }
  }, [qp]);
};

export default OAuthLogin;
