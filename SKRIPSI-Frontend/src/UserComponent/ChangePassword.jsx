import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ChangePassword = () => {
  const [user, setUser] = useState({});
  const [sessionUserName, setSessionUserName] = useState("");
  const [sessionJWTName, setSessionJWTName] = useState("");

  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const manager = JSON.parse(sessionStorage.getItem("active-manager"));
  const employee = JSON.parse(sessionStorage.getItem("active-employee"));

  const [loginRequest, setLoginRequest] = useState({
    userId: "",
    password: "",
  });

  useEffect(() => {
    if (admin !== null) {
      loginRequest.userId = admin.id;
      setSessionJWTName("admin-jwtToken");
      setSessionUserName("active-admin");
      setUser(admin);
    } else if (manager !== null) {
      loginRequest.userId = manager.id;
      setSessionJWTName("manager-jwtToken");
      setSessionUserName("active-manager");
      setUser(manager);
    } else if (employee !== null) {
      loginRequest.userId = employee.id;
      setSessionJWTName("employee-jwtToken");
      setSessionUserName("active-employee");
      setUser(employee);
    }
  }, []);

  const navigate = useNavigate();

  const handleUserInput = (e) => {
    setLoginRequest({
      ...loginRequest,
      [e.target.name]: e.target.value,
    });
  };

  const userChangePassword = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/user/changePassword", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    }).then((result) => {
      console.log("result", result);
      result.json().then((res) => {
        console.log(res);

        if (res.success) {
          console.log("Got the success response");

          toast.success(res.responseMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setTimeout(() => {
            sessionStorage.removeItem(sessionJWTName);
            sessionStorage.removeItem(sessionUserName);
            navigate("/user/login");
            window.location.reload(true);
          }, 3000); // Redirect after 3 seconds
        } else {
          console.log("Didn't got success response");
          toast.error("It seems server is down", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            window.location.reload(true);
          }, 1000); // Redirect after 3 seconds
        }
      });
    });
  };

  return (
    <div className="wrapper">
      <div className="hold-transition login-page">
        
        <div className="login-box">
          <div className="login-logo">
            <b style={{ color: 'purple' }}>Monitoring</b> Project
          </div>
          {/* /.login-logo */}
          <div className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">You are only one step a way from your new password, recover your password now.</p>
                <div className="input-group mb-3">
                  
                  {/* User Email */}
                  <input
                    type="text"
                    className="form-control"
                    value={user.emailId}
                    required
                    readOnly
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-envelope" />
                    </div>
                  </div>
                </div>

                
                {/* User Contact */}
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={user.contact}
                    required
                    readOnly
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-phone" />
                    </div>
                  </div>
                </div>
                
              <form>
                {/* User Password */}
                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Your New Password"
                    id="password"
                    name="password"
                    onChange={handleUserInput}
                    value={loginRequest.password}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      onClick={userChangePassword}
                    >Change password</button>
                  </div>
                  {/* /.col */}
                </div>
                <ToastContainer />
              </form>
              <p className="mt-3 mb-1">
                <a href="/user/login">Login</a>
              </p>
            </div>
            {/* /.login-card-body */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChangePassword;
