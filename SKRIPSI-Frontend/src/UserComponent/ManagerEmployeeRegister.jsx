import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/dist/js/adminlte.min.js";
import "admin-lte/plugins/fontawesome-free/css/all.min.css";
import "admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ManagerEmployeeRegister = () => {
  const [user, setUser] = useState({
    name: "",
    emailId: "",
    password: "",
  });

  let menuName = null;

  if (document.URL.indexOf("manager") != -1) {
    user.role = "admin";
    menuName = "Manager";
  } else if (document.URL.indexOf("employee") != -1) {
    user.role = "employee";
    menuName = "Employee";
  }

  const handleUserInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };


  const saveUser = (e) => {
    e.preventDefault();

    request({
      url: API_BASE_URL + "/api/user/" + user.role + "/register",
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify(user),
    }).then((result) => {
      console.log(result);
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
          window.location.reload(true);
        }, 1000); // Redirect after 3 seconds
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

  return (
    <div className="content-wrapper">
      <section className="content-header"></section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card form-card ms-2 me-2 mb-5 custom-bg border-color">
                <div className="card-header">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-6">
                        <h1>Register {menuName}</h1>
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
                            Register {menuName}
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-body register-card-body">
                  <p className="login-box-msg">Register a new {user.role}</p>
                  <form className="row g-3" onSubmit={saveUser}>
                    {/* FirstName */}
                    <div className="col-md-6 mb-3 text-color">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        id="name"
                        name="name"
                        onChange={handleUserInput}
                        value={user.name}
                        required
                      />
                    </div>

                    {/* Email ID */}
                    <div className="col-md-6 input-group mb-3">
                      <input
                        type="email"
                        className="form-control"
                        id="emailId"
                        name="emailId"
                        placeholder="Email"
                        onChange={handleUserInput}
                        value={user.emailId}
                        required
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <span className="fas fa-envelope" />
                        </div>
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-md-6 input-group mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        id="password"
                        name="password"
                        onChange={handleUserInput}
                        value={user.password}
                        required
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <span className="fas fa-lock" />
                        </div>
                      </div>
                    </div>

                    <div className="d-flex aligns-items-end justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-primary float-right"
                      >
                        Register
                      </button>
                    </div>
                  </form>
                </div>
                {/* /.form-box */}
              </div>
              {/* /.card */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManagerEmployeeRegister;
