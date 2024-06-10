import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const UpdateProjectStatus = () => {
  const [updateStatusRequest, setUpdateStatusRequest] = useState({
    projectId: "",
    projectStatus: "",
  });

  const [allStatus, setAllStatus] = useState([]);
  const location = useLocation();
  const project = location.state;

  updateStatusRequest.projectId = project.id;

  const navigate = useNavigate();

  const handleUserInput = (e) => {
    setUpdateStatusRequest({
      ...updateStatusRequest,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const getAllStatus = async () => {
      const allStatus = await retrieveAllStatus();
      if (allStatus) {
        setAllStatus(allStatus);
      }
    };

    getAllStatus();
  }, []);

  const retrieveAllStatus = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/project/allStatus"
    );
    console.log(response.data);
    return response.data;
  };

  const updateProjectStatus = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/project/updateStatus", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateStatusRequest),
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
            navigate("/user/employee/project/all");
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
                        <h1>Update Project Status</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{backgroundColor: 'transparent'}}>
                          <li className="breadcrumb-item" ><a href="#">Home</a></li>
                          <li className="breadcrumb-item" ><a href="/user/employee/project/all">My Project</a></li>
                          <li className="breadcrumb-item active">Update Project Status</li>
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

                  <div className="mb-3 mt-1">
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
                    <div class="mb-2">
                      <label htmlFor="quantity" className="form-label">
                        Status
                      </label>
                      <select
                        name="projectStatus"
                        onChange={handleUserInput}
                        className="form-control"
                        required
                      >
                        <option value="">Select Status</option>

                        {allStatus.map((status) => {
                          return <option value={status}> {status} </option>;
                        })}
                      </select>
                    </div>
                    <button
                      type="submit"
                      class="btn float-right"
                      onClick={updateProjectStatus}
                      style={{backgroundColor: "#3393df", color: "white", fontWeight: "bold"}}
                    >
                      Update Status
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

export default UpdateProjectStatus;
