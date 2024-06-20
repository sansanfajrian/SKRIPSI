import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { request } from "../util/APIUtils";
import { ACCESS_TOKEN, API_BASE_URL } from "../constants";

const AssignProjectToManager = () => {
  const [assignRequest, setAssignRequest] = useState({
    managerId: "",
    projectId: "",
  });

  const [allManagers, setAllManagers] = useState([]);
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
    const getAllManager = async () => {
      const allManager = await retrieveAllManagers();
      if (allManager) {
        setAllManagers(allManager);
      }
    };

    getAllManager();
  }, []);

  const retrieveAllManagers = async () => {
    const managers = await request({
      url: API_BASE_URL + "/api/user/manager/all",
      method: "GET",
    })
      .then((response) => {
        return response.users;
      })
      .catch((error) => {
        console.log(error);
      });

    return managers;
  };

  const assignProject = (e) => {
    e.preventDefault();

    request({
      url: API_BASE_URL + "/api/project/assignToManager",
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
          navigate("/user/admin/project/all");
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
                        <h1>Assign Project To Manager</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol
                          className="breadcrumb float-sm-right"
                          style={{ backgroundColor: "transparent" }}
                        >
                          <li className="breadcrumb-item">
                            <Link href="#">Home</Link>
                          </li>
                          <li className="breadcrumb-item">
                            <a href="/user/admin/project/all">All Project</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Assign Project To Manager
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
                      value={project.description}
                      readOnly
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
                        Assign Project To Manager
                      </label>
                      <select
                        name="managerId"
                        onChange={handleUserInput}
                        className="form-control"
                        required
                      >
                        <option value="">Select Manager</option>

                        {allManagers.map((manager, index) => {
                          return (
                            <option key={index} value={manager.id}>
                              {" "}
                              {manager.firstName + " " + manager.lastName}{" "}
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

export default AssignProjectToManager;
