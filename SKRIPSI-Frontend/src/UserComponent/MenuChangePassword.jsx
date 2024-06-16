import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { request } from "../util/APIUtils";
import { API_BASE_URL } from "../constants";

const MenuChangePassword = () => {
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

    request({
      url: API_BASE_URL + "/api/user/changePassword",
      method: "POST",
      body: JSON.stringify(loginRequest),
      contentType: "application/json",
    }).then((result) => {
      if (result.success) {
        console.log("Got the success response");

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
  };

  const boldHrStyle = {
    border: "0",
    borderBottom: "1px solid black",
    fontWeight: "bold",
  };

  return (
    <div className="content-wrapper">
      <section className="content-header"></section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {/* /.login-logo */}
              <div className="card form-card ms-2 me-2 mb-5 custom-bg border-color">
                <div className="card-header">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-6">
                        <h1>Change Password</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol
                          className="breadcrumb float-sm-right"
                          style={{ backgroundColor: "transparent" }}
                        >
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Change Password
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body login-card-body">
                  <div className="row">
                    <form>
                      <div className="col-md-6">
                        <p className="">
                          You are only one step a way from your new password,
                          recover your password now.
                        </p>

                        {/* User Email */}
                        <div className="input-group mb-3">
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

                        <ToastContainer />
                      </div>
                      <div className="col-12">
                        <hr style={boldHrStyle} />
                        <div className="row">
                          <div className="col-12">
                            <button
                              type="submit"
                              className="btn btn-primary float-right"
                              onClick={userChangePassword}
                            >
                              Change password
                            </button>
                          </div>
                          {/* /.col */}
                        </div>
                      </div>
                    </form>
                  </div>
                  {/* /.login-card-body */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MenuChangePassword;
