import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/plugins/fontawesome-free/css/all.min.css';
import 'admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css';
import 'admin-lte/dist/js/adminlte.min.js';

const EditManagerEmployee = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    contact: "",
    street: "",
    city: "",
    pincode: "",
    role: "",
    age: "",
    sex: "",
  });

  const location = useLocation();
  const userData = location.state;

  const [list, setList] = useState(userData)
  
  useEffect(() => {

    let {firstName, lastName, emailId, contact, street, city, pincode, role, age, sex} = list
    setUser({firstName, lastName, emailId, contact, street, city, pincode, role, age, sex})
  
  }, []); 

  const navigate = useNavigate();
  let menuName = null;

  if (document.URL.indexOf("admin") != -1) {
    user.role = "admin";
    menuName = "Admin"
  } else if (document.URL.indexOf("manager") != -1) {
    user.role = "manager";
    menuName = "Manager"
  } else if (document.URL.indexOf("employee") != -1) {
    user.role = "employee";
    menuName = "Employee"
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

  const saveUser = (event) => {
    event.preventDefault();
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
    <div className="content-wrapper">

    <section className="content-header">
    </section>


    <section className="content">
      <div className="container-fluid">
        
        <div className="row">
          
          <div className="col-12">

                <div className="card form-card ms-2 me-2 mb-5 custom-bg border-color">
                  <div className="card-header">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-sm-6">
                          <h1>Edit Data {menuName}</h1>
                        </div>
                        <div className="col-sm-6">
                          <ol className="breadcrumb float-sm-right" style={{backgroundColor: 'transparent'}}>
                            <li className="breadcrumb-item" ><a href="#">Home</a></li>
                            <li className="breadcrumb-item active">Register {menuName}</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-body register-card-body">
                    <p className="login-box-msg">Edit {user.role}</p>
                    <form className="row g-3" onSubmit={saveUser}>

                      {/* FirstName */}
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

                      {/* LastName */}
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
                      
                      {/* Email ID */}
                      <div className="col-md-6 input-group mb-3">
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

                      {/* Gender */}
                      <div className="col-md-6 input-group mb-3">
                        <select
                          onChange={handleUserInput}
                          className="form-control"
                          name="sex"
                          value={user.sex}
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

                      {/* Contact Number */}
                      <div className="col-md-6 input-group mb-3">
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

                      {/* Age */}
                      <div className="col-md-6 input-group mb-3">
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

                      <div className="col-md-12">
                        <h6 style={{color: "#bcbcbc"}}>Alamat</h6>
                      </div>
                      {/* Street */}
                      <div className="col-md-12 input-group mb-3">
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

                      {/* City */}
                      <div className="col-md-6 input-group mb-3">
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

                      {/* Pincode */}
                      <div className="col-md-6 input-group mb-3">
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

                      <div className="d-flex aligns-items-end justify-content-end">
                          <button type="submit" className="btn float-right" style={{backgroundColor: "#3393df", color: "white", fontWeight: "bold"}}>Save Data</button>
                        </div>
                    </form>
                  </div>
                  {/* /.form-box */}
                </div>{/* /.card */}
              </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default EditManagerEmployee;
