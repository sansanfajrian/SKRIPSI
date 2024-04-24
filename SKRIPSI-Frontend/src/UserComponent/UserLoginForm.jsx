import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
               if (res.user.role === "admin") {
                 sessionStorage.setItem(
                   "active-admin",
                   JSON.stringify(res.user)
                 );
                 sessionStorage.setItem("admin-jwtToken", res.user.jwtToken);
               } else if (res.user.role === "employee") {
                 sessionStorage.setItem(
                   "active-employee",
                   JSON.stringify(res.user)
                 );
                 sessionStorage.setItem("employee-jwtToken", res.user.jwtToken);
               } else if (res.user.role === "manager") {
                 sessionStorage.setItem(
                   "active-manager",
                   JSON.stringify(res.user)
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
    <div>
      <div className="mt-2 d-flex aligns-items-center justify-content-center">
        <div
          className="card form-card border-color custom-bg"
          style={{ width: "25rem" }}
        >
          <div className="card-header bg-color text-center custom-bg-text">
            <h4 className="card-title">User Login</h4>
          </div>
          <div className="card-body">
            <form>

              <div className="mb-3 text-color">
                <label for="emailId" class="form-label">
                  <b>Email Id</b>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="emailId"
                  name="emailId"
                  onChange={handleUserInput}
                  value={loginRequest.emailId}
                />
              </div>
              <div className="mb-3 text-color">
                <label for="password" className="form-label">
                  <b>Password</b>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  onChange={handleUserInput}
                  value={loginRequest.password}
                  autoComplete="on"
                />
              </div>
              <button
                type="submit"
                className="btn bg-color custom-bg-text"
                onClick={loginAction}
              >
                Login
              </button>
              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginForm;
