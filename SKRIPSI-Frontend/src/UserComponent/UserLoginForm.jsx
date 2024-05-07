import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/plugins/fontawesome-free/css/all.min.css';
import 'admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css';
import 'admin-lte/dist/js/adminlte.min.js';

const UserLoginForm = () => {
  let navigate = useNavigate();

  const [loginRequest, setLoginRequest] = useState({
    emailId: "",
    password: ""
  });

  const handleUserInput = (e) => {
    setLoginRequest({ ...loginRequest, [e.target.name]: e.target.value });
  };

   const loginAction = (e) => {
     fetch("http://localhost:8080/api/user/login", {
       method: "POST",
       headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
       },
       body: JSON.stringify(loginRequest),
     })
       .then((result) => {
         console.log("result", result);
         result.json().then((res) => {
           console.log(res);

           if (res.success) {
             console.log("Got the success response");

             if (res.jwtToken !== null) {
               console.log("JWT TOKEN not null, positive response");
               console.log("Testing" + res.user.role);
               if (res.user.role === "admin") {
                 sessionStorage.setItem(
                   "active-admin",
                   JSON.stringify(res.user)
                 );
                 sessionStorage.setItem(
                   "username",
                   JSON.stringify(res.user.firstName)
                 );
                 sessionStorage.setItem("admin-jwtToken", res.user.jwtToken);
               } else if (res.user.role === "employee") {
                 sessionStorage.setItem(
                   "active-employee",
                   JSON.stringify(res.user)
                 );
                 sessionStorage.setItem(
                   "username",
                   JSON.stringify(res.user.firstName)
                 );
                 sessionStorage.setItem("employee-jwtToken", res.user.jwtToken);
               } else if (res.user.role === "manager") {
                 sessionStorage.setItem(
                   "active-manager",
                   JSON.stringify(res.user)
                 );
                 sessionStorage.setItem(
                   "username",
                   JSON.stringify(res.user.firstName)
                 );
                 sessionStorage.setItem("manager-jwtToken", res.user.jwtToken);
               }
             }

             if (res.jwtToken !== null) {
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
                if (res.user.role === "admin") {
                  window.location.href = "/user/admin/project/all";
                } else if (res.user.role === "employee") {
                  window.location.href = "/user/employee/project/all";
                } else if (res.user.role === "manager") {
                  window.location.href = "/user/manager/project/all";
                }
               }, 1000); // Redirect after 3 seconds
             } else {
               toast.error(res.responseMessage, {
                 position: "top-center",
                 autoClose: 1000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,
                 progress: undefined,
               });
             }
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
           }
         });
       })
       .catch((error) => {
         console.error(error);
         toast.error("It seems server is down", {
           position: "top-center",
           autoClose: 1000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
         });
       });
     e.preventDefault();
   };

  return (
    <div class="wrapper">
      <div className="hold-transition login-page">

        <div className="login-box">
          <div className="login-logo">
            <b style={{ color: 'purple' }}>Monitoring</b> Project
          </div>
          <div className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Login to start your session</p>
              <form>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email ID"
                    id="emailId"
                    name="emailId"
                    onChange={handleUserInput}
                    value={loginRequest.emailId}
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
                      <label htmlFor="remember">
                        Remember Me
                      </label>
                    </div>
                  </div>
                  <div className="col-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      onClick={loginAction}
                    >Login
                    </button>
                  </div>
                </div>
                <ToastContainer />
              </form>
              <div className="social-auth-links text-center mb-3">
                <p>- OR -</p>
                <a href="#" className="btn btn-block btn-danger">
                  <i className="fab fa-google-plus mr-2" /> Sign in using Google+
                </a>
              </div>
              <p className="mb-1">
                <a href="/user/forgot/password">I forgot my password</a>
              </p>
              <p className="mb-0">
                <a href="/user/admin/register" className="text-center">Register a new membership</a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserLoginForm;
