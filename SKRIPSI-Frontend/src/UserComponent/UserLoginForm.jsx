import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/dist/js/adminlte.min.js";
import "admin-lte/plugins/fontawesome-free/css/all.min.css";
import "admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ACCESS_TOKEN, API_BASE_URL, GOOGLE_AUTH_URL } from "../constants";
import { request } from "../util/APIUtils";

const UserLoginForm = () => {
  const [loginRequest, setLoginRequest] = useState({
    email: "",
    password: "",
  });

  const location = useLocation();

  useEffect(() => {
    if (location.state?.error) {
      toast.error("Gagal masuk ke aplikasi, akun anda belum terdaftar", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [location.state]);

  const handleUserInput = (e) => {
    setLoginRequest({ ...loginRequest, [e.target.name]: e.target.value });
  };

  const loginAction = (e) => {
    e.preventDefault();

    request({
      url: API_BASE_URL + "/api/user/login",
      method: "POST",
      body: JSON.stringify(loginRequest),
      contentType: "application/json",
    })
      .then((result) => {
        if (result.accessToken) {
          localStorage.setItem(ACCESS_TOKEN, result.accessToken);

          const role = result.user.role;

          sessionStorage.setItem(`active-${role}`, JSON.stringify(result.user));
          sessionStorage.setItem(
            "username",
            JSON.stringify(result.user.name)
          );
          sessionStorage.setItem(`${role}-jwtToken`, result.accessToken);

          toast.success(result.responseMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setTimeout(() => {
            if (result.user.role === "admin") {
              window.location.href = "/user/admin/project/all";
            } else if (result.user.role === "employee") {
              window.location.href = "/user/employee/project/all";
            } else if (result.user.role === "manager") {
              window.location.href = "/user/manager/project/all";
            }
          }, 1000); // Redirect after 3 seconds
        } else {
          toast.error(`${result.error}: ${result.message}`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(`${error.error}: ${error.message}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <div className="wrapper">
      <div className="hold-transition login-page">
        <div className="login-box">
          <div className="login-logo">
            <b style={{ color: "purple" }}>Monitoring</b> Project
          </div>
          <div className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Login to start your session</p>
              {/* <form>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email ID"
                    id="email"
                    name="email"
                    onChange={handleUserInput}
                    value={loginRequest.email}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-envelope" />
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    id="password"
                    name="password"
                    onChange={handleUserInput}
                    value={loginRequest.password}
                    autoComplete="on"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-8">
                    <div className="icheck-primary">
                      <input type="checkbox" id="remember" />
                      <label htmlFor="remember">Remember Me</label>
                    </div>
                  </div>
                  <div className="col-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      onClick={loginAction}
                    >
                      Login
                    </button>
                  </div>
                </div>
                <ToastContainer />
              </form> */}
              <div className="social-auth-links text-center mb-3">
                {/* <p>- OR -</p> */}
                <Link to={GOOGLE_AUTH_URL} className="btn btn-block btn-danger">
                  <i className="fab fa-google-plus mr-2" /> Sign in using
                  Google+
                </Link>
              </div>
              {/* <p className="mb-1">
                <a href="/user/forgot/password">I forgot my password</a>
              </p> */}
              {/* <p className="mb-0">
                <a href="/user/admin/register" className="text-center">
                  Register a new membership
                </a>
              </p> */}
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginForm;
