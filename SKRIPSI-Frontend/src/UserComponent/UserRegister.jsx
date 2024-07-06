import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/dist/js/adminlte.min.js';
import 'admin-lte/plugins/fontawesome-free/css/all.min.css';
import 'admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GOOGLE_AUTH_URL } from "../constants";

const UserRegister = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    contact: "",
    street: "",
    city: "",
    pincode: "",
    role: "",
    age: "",
    sex: "",
  });

  const navigate = useNavigate();

  if (document.URL.indexOf("admin") != -1) {
    user.role = "admin";
  } else if (document.URL.indexOf("manager") != -1) {
    user.role = "manager";
  } else if (document.URL.indexOf("employee") != -1) {
    user.role = "employee";
  }

  console.log("ROLE FECTHED : " + user.role);

  const handleUserInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const [genders, setGenders] = useState([]);

  const retrieveAllGenders = async () => {
    const response = await axios.get("http://localhost:8080/api/user/gender");
    return response.data;
  };

  useEffect(() => {
    const getAllGenders = async () => {
      const allGenders = await retrieveAllGenders();
      if (allGenders) {
        setGenders(allGenders.genders);
      }
    };

    getAllGenders();
  }, []);

  const saveUser = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/user/" + user.role + "/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
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
            navigate("/user/login");
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
    });
  };

  return (
    <div className="wrapper">
      <div className="d-flex aligns-items-center justify-content-center" style={{backgroundColor:"#e9ecef"}}>
      {/* <div className="hold-transition register-page*/}

        <div className="register-box my-2">
          <div className="register-logo">
            <b style={{ color:'purple' }}>Monitoring</b> Project
          </div>
          <div className="card">
            <div className="card-body register-card-body">
              <p className="login-box-msg">Register a new membership</p>
              <form className="row g-3" onSubmit={saveUser}>

                {/* 
                <div className="col-md-6 mb-3 text-color">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                      id="firstName"
                      name="firstName"
                      onChange={handleUserInput}
                      value={user.firstName}
                      required
                    />
                </div>

                
                <div className="col-md-6 mb-3 text-color">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    id="lastName"
                    name="lastName"
                    onChange={handleUserInput}
                    value={user.lastName}
                    required
                  />
                </div>
                

                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="emailId"
                    name="emailId"
                    placeholder="Email ID"
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

                
                <div className="input-group mb-3">
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

                
                <div className="input-group mb-3">
                  <select
                    onChange={handleUserInput}
                    className="form-control"
                    name="sex"
                    required
                  >
                    <option value="0">Select Sex</option>

                    {genders.map((gender) => {
                      return <option value={gender}> {gender} </option>;
                    })}
                  </select>
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-caret-down" />
                    </div>
                  </div>
                </div>

                
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Contact Number"
                    id="contact"
                    name="contact"
                    onChange={handleUserInput}
                    value={user.contact}
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-phone" />
                    </div>
                  </div>
                </div>

                
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Age"
                    id="age"
                    name="age"
                    onChange={handleUserInput}
                    value={user.age}
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user" />
                    </div>
                  </div>
                </div>

                
                <div className="input-group mb-3">
                  <textarea
                    className="form-control"
                    id="street"
                    placeholder="Street"
                    name="street"
                    rows="3"
                    onChange={handleUserInput}
                    value={user.street}
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-map" />
                    </div>
                  </div>
                </div>

                
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City"
                    id="city"
                    name="city"
                    onChange={handleUserInput}
                    value={user.city}
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-building" />
                    </div>
                  </div>
                </div>

                
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    id="pincode"
                    placeholder="Pincode"
                    name="pincode"
                    onChange={handleUserInput}
                    value={user.pincode}
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-inbox" />
                    </div>
                  </div>
                </div>

                <div className="d-flex aligns-items-center justify-content-center">
                    <button type="submit" className="btn btn-primary btn-block">Register</button>
                  </div>*/}
                  </form> 
              <div className="social-auth-links text-center">
                {/* <p>- OR -</p> */}
                <Link to={GOOGLE_AUTH_URL} className="btn btn-block btn-danger">
                  <i className="fab fa-google-plus mr-2" />
                  Sign up using Google+
                </Link>
              </div>
              <a href="/user/login" className="text-center">I already have a membership</a>
            </div>
            {/* /.form-box */}
          </div>{/* /.card */}
        </div>


      </div>
    </div>
  );
};

export default UserRegister;
