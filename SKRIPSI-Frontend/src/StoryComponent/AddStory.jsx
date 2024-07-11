import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const AddStory = () => {
  const [addStoryRequest, setAddStoryRequest] = useState({
    code: "",
    name: "",
    status: "started", // Set default status to "started"
    projectId: ""
  });
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    request({
      url: API_BASE_URL + "/api/project/fetch",
      method: "GET",
    }).then((response) => {
      console.log("Projects API response:", response);
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
    setAddStoryRequest({
      ...addStoryRequest,
      [e.target.name]: e.target.value,
    });
  };

  const saveStory = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('accessToken');

    request({
      url: API_BASE_URL + "/api/story/add",
      method: "POST",
      body: JSON.stringify(addStoryRequest),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
      },
    }).then((result) => {
      if (result = true) {
        toast.success("Story created successfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate("/user/admin/story/all");
        }, 1000);
      } else {
        console.log(result);
        toast.error("Error creating story", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    }).catch(error => {
      console.error("Error:", error);
      toast.error("Failed to add story. Please try again.", {
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
                        <h1>Add Story</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Add Story
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={saveStory}>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="code" className="form-label">
                        Story Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="code"
                        placeholder="Enter story code"
                        name="code"
                        onChange={handleUserInput}
                        value={addStoryRequest.code}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Story Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter story name"
                        name="name"
                        onChange={handleUserInput}
                        value={addStoryRequest.name}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        className="form-control"
                        id="status"
                        name="status"
                        onChange={handleUserInput}
                        value={addStoryRequest.status}
                        disabled // Lock the dropdown to "started"
                      >
                        <option value="started">Started</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
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
                        value={addStoryRequest.projectId}
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
                      value="Add Story"
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

export default AddStory;
