import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getUrlParameter = (name) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  useEffect(() => {
    const token = getUrlParameter("token");
    const error = getUrlParameter("error");
    

    if (token) {
      localStorage.setItem(ACCESS_TOKEN, token);

      request({
        url: API_BASE_URL + "/api/user/me",
        method: "GET",
      })
        .then((response) => {
          const role = response.role;
          sessionStorage.setItem(`active-${role}`, JSON.stringify(response));
          sessionStorage.setItem("username", JSON.stringify(response.name));
          sessionStorage.setItem(`${role}-jwtToken`, token);

          if (response.role === "admin") {
            window.location.href = "/user/admin/project/all";
          } else if (response.role === "employee") {
            window.location.href = "/user/employee/project/all";
          } else if (response.role === "manager") {
            window.location.href = "/user/manager/project/all";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // Redirect to /login with error message
      navigate("/user/login", { state: { error: true } });
    }
  }, [navigate, location.search]);

  // By default, return null since this component handles redirection via useEffect
  return null;
};

export default OAuth2RedirectHandler;
