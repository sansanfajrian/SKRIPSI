import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const AddRetrospective = () => {
  const [addRetrospectiveRequest, setAddRetrospectiveRequest] = useState({
    status: "Start", // Lock status to "Start"
    projectId: "",
    fromId: "", // Change to string
    toId: "", // Change to string
    sprintId: "", // Change to string
    description: "" // New description field
  });
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [dropdownDisabled, setDropdownDisabled] = useState(true); // State to disable dropdowns
  const navigate = useNavigate();

  useEffect(() => {
    request({
      url: API_BASE_URL + "/api/project/fetch/employee",
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

  const fetchProjectDetails = (projectId) => {
    request({
      url: `${API_BASE_URL}/api/project/${projectId}/members`,
      method: "GET",
    }).then((response) => {
      setMembers(response);
    }).catch((error) => {
      console.error("Error fetching project members:", error);
      setMembers([]);
    });

    request({
      url: `${API_BASE_URL}/api/project/${projectId}/sprints`,
      method: "GET",
    }).then((response) => {
      setSprints(response);
    }).catch((error) => {
      console.error("Error fetching project sprints:", error);
      setSprints([]);
    });
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setAddRetrospectiveRequest({
      ...addRetrospectiveRequest,
      projectId,
      fromId: "", // Reset to empty string
      toId: "", // Reset to empty string
      sprintId: "" // Reset to empty string
    });
    if (projectId) {
      fetchProjectDetails(projectId);
      setDropdownDisabled(false); // Enable dropdowns when project is selected
    } else {
      setMembers([]);
      setSprints([]);
      setDropdownDisabled(true); // Disable dropdowns when no project is selected
    }
  };

  const handleUserInput = (e) => {
    setAddRetrospectiveRequest({
      ...addRetrospectiveRequest,
      [e.target.name]: e.target.value,
    });
  };

  const saveRetrospective = (e) => {
    e.preventDefault();

    // Convert fromId, toId, sprintId to integers before sending
    const retrospectiveRequest = {
      ...addRetrospectiveRequest,
      fromId: parseInt(addRetrospectiveRequest.fromId),
      toId: parseInt(addRetrospectiveRequest.toId),
      sprintId: parseInt(addRetrospectiveRequest.sprintId)
    };

    const accessToken = localStorage.getItem('accessToken');
    console.log(JSON.stringify(retrospectiveRequest));
    request({
      url: API_BASE_URL + "/api/retrospective/add",
      method: "POST",
      body: JSON.stringify(retrospectiveRequest),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
      },
    }).then((result) => {
      if (result) {
        toast.success("Retrospective created successfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate("/user/admin/retrospective/all");
        }, 1000);
      } else {
        console.log(result);
        toast.error("Error creating retrospective", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    }).catch(error => {
      console.error("Error:", error);
      toast.error("Failed to add retrospective. Please try again.", {
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
                        <h1>Add Retrospective</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Add Retrospective
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={saveRetrospective}>
                  <div className="card-body">
                    
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        className="form-control"
                        id="status"
                        name="status"
                        onChange={handleUserInput}
                        value={addRetrospectiveRequest.status}
                        disabled // Lock the dropdown to "Start"
                      >
                        <option value="Start">Start</option>
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
                        onChange={handleProjectChange}
                        value={addRetrospectiveRequest.projectId}
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
                    <div className="mb-3">
                      <label htmlFor="fromId" className="form-label">
                        From
                      </label>
                      <select
                        className="form-control"
                        id="fromId"
                        name="fromId"
                        onChange={handleUserInput}
                        value={addRetrospectiveRequest.fromId}
                        required
                        disabled={dropdownDisabled} // Disable when project is not selected
                      >
                        <option value="">Select a member</option>
                        {members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="toId" className="form-label">
                        To
                      </label>
                      <select
                        className="form-control"
                        id="toId"
                        name="toId"
                        onChange={handleUserInput}
                        value={addRetrospectiveRequest.toId}
                        required
                        disabled={dropdownDisabled} // Disable when project is not selected
                      >
                        <option value="">Select a member</option>
                        {members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="sprintId" className="form-label">
                        Sprint
                      </label>
                      <select
                        className="form-control"
                        id="sprintId"
                        name="sprintId"
                        onChange={handleUserInput}
                        value={addRetrospectiveRequest.sprintId}
                        required
                        disabled={dropdownDisabled} // Disable when project is not selected
                      >
                        <option value="">Select a sprint</option>
                        {sprints.map((sprint) => (
                          <option key={sprint.sprintId} value={sprint.sprintId}>
                            {sprint.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        onChange={handleUserInput}
                        value={addRetrospectiveRequest.description}
                      ></textarea>
                    </div>
                  </div>
                  <div className="card-footer">
                    <input
                      type="submit"
                      className="btn float-right"
                      value="Add Retrospective"
                      style={{
                        backgroundColor: "#3393df",
                        color: "white",
                        fontWeight: "bold",
                      }}
                      disabled={dropdownDisabled} // Disable submit button when project is not selected
                    />
                    <ToastContainer />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default AddRetrospective;
