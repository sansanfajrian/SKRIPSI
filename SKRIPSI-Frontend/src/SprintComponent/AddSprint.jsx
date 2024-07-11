import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const AddSprint = () => {
  const [addSprintRequest, setAddSprintRequest] = useState({
    name: "",
    startDate: "",
    endDate: "",
    projectId: ""
  });
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    request({
      url: API_BASE_URL + "/api/project/fetch",
      method: "GET",
    }).then((response) => {
      console.log("Projects API response:", response); // Log the response
      if (response.projects && Array.isArray(response.projects)) {
        setProjects(response.projects);
      } else {
        console.error("Expected an array but got:", response);
        setProjects([]); // Set to an empty array if the response is not as expected
      }
    }).catch((error) => {
      console.error("Error fetching projects:", error);
      setProjects([]); // Set to an empty array in case of error
    });
  }, []);  

  const handleUserInput = (e) => {
    setAddSprintRequest({
      ...addSprintRequest,
      [e.target.name]: e.target.value,
    });
  };

  const saveSprint = (e) => {
    e.preventDefault();

    // Get the access token from your OAuth flow (localStorage, state, etc.)
    const accessToken = localStorage.getItem('accessToken'); // Example

    request({
      url: API_BASE_URL + "/api/sprint/add",
      method: "POST",
      body: JSON.stringify(addSprintRequest),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
      },
    }).then((result) => {
      if (result = true) {
        toast.success("Sprint created successfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate("/user/admin/sprint/all");
        }, 1000);
      } else {
        console.log(result);
        toast.error("Error creating sprint", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    }).catch(error => {
      console.error("Error:", error);
      toast.error("Failed to add sprint. Please try again.", {
        position: "top-center",
        autoClose: 2000,
      });
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
                        <h1>Add Sprint</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Add Sprint
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={saveSprint}>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Sprint Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter sprint name"
                        name="name"
                        onChange={handleUserInput}
                        value={addSprintRequest.name}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="startDate" className="form-label">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        name="startDate"
                        onChange={handleUserInput}
                        value={addSprintRequest.startDate}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="endDate" className="form-label">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="endDate"
                        name="endDate"
                        onChange={handleUserInput}
                        value={addSprintRequest.endDate}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="projectId" className="form-label">
                        Project
                      </label>
                      <select
                        className="form-control"
                        id="projectId"
                        name="projectId"
                        onChange={handleUserInput}
                        value={addSprintRequest.projectId}
                        required
                      >
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="card-footer">
                    <input
                      type="submit"
                      className="btn float-right"
                      value="Add Sprint"
                      style={{
                        backgroundColor: "#3393df",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                    <ToastContainer />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddSprint;
