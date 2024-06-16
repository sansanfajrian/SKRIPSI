import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { request } from "../util/APIUtils";
import { API_BASE_URL } from "../constants";

const AssignProjectToEmployee = () => {
  const [assignRequest, setAssignRequest] = useState({
    employeeId: "",
    projectId: "",
  });

  const [allEmployees, setAllEmployees] = useState([]);
  const location = useLocation();
  const project = location.state;

  assignRequest.projectId = project.id;

  const navigate = useNavigate();

  const handleUserInput = (e) => {
    setAssignRequest({
      ...assignRequest,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const getAllEmployee = async () => {
      const allEmployee = await retrieveAllEmployees();
      if (allEmployee) {
        setAllEmployees(allEmployee);
      }
    };

    getAllEmployee();
  }, []);

  const retrieveAllEmployees = async () => {
    const employees = await request({
      url: API_BASE_URL + "/api/user/employee/all",
      method: "GET",
    })
      .then((response) => {
        return response.users;
      })
      .catch((error) => {
        console.log(error);
      });

    return employees;
  };

  const assignProject = (e) => {
    e.preventDefault();

    request({
      url: API_BASE_URL + "/api/project/assignToEmployee",
      method: "POST",
      body: JSON.stringify(assignRequest),
      contentType: "application/json",
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
          navigate("/user/manager/project/all");
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
              <div
                className="card form-card ms-2 me-2 mb-5 custom-bg border-color"
                style={{
                  height: "45rem",
                }}
              >
                <div className="card-header">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-6">
                        <h1>Assign Project To Employee</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol
                          className="breadcrumb float-sm-right"
                          style={{ backgroundColor: "transparent" }}
                        >
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item">
                            <a href="/user/manager/project/all">All Project</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Assign Project To Employee
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">
                      Project Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={project.name}
                      required
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Project Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows="3"
                      readOnly
                      value={project.description}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">
                      Project Created Date
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={project.createdDate}
                      required
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">
                      Project Deadline Date
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={project.deadlineDate}
                      required
                      readOnly
                    />
                  </div>

                  <form>
                    <div className="mb-3">
                      <label htmlFor="quantity" className="form-label">
                        Assign Project To Emplooyee
                      </label>
                      <select
                        name="employeeId"
                        onChange={handleUserInput}
                        className="form-control"
                        required
                      >
                        <option value="">Select Employee</option>

                        {allEmployees.map((employeee) => {
                          return (
                            <option value={employeee.id}>
                              {" "}
                              {employeee.firstName +
                                " " +
                                employeee.lastName}{" "}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="btn float-right"
                      onClick={assignProject}
                      style={{
                        backgroundColor: "#3393df",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Update
                    </button>
                    <ToastContainer />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssignProjectToEmployee;
