import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const EditRetrospective = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editRetrospectiveRequest, setEditRetrospectiveRequest] = useState({
    status: "Start",
    projectId: "",
    fromId: "",
    toId: "",
    sprintId: "",
    description: "", 
  });

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [dropdownDisabled, setDropdownDisabled] = useState(true);

  useEffect(() => {
    fetchRetrospectiveDetails(id);
    fetchProjects(); // Fetch projects when the component mounts
  }, [id]);

  const fetchRetrospectiveDetails = (id) => {
    request({
      url: `${API_BASE_URL}/api/retrospective/get/${id}`,
      method: "GET",
    })
      .then((response) => {
        console.log("Retrospective details:", response);
        const {
          status,
          projectId,
          fromId,
          toId,
          sprintId,
          description,
          // Remove unused fields if not needed
        } = response;
        setEditRetrospectiveRequest({
          status,
          projectId,
          fromId,
          toId,
          sprintId,
          description,
        });
        if (projectId) {
          fetchProjectDetails(projectId);
          setDropdownDisabled(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching retrospective details:", error);
        toast.error("Failed to fetch retrospective details", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };

  const fetchProjects = () => {
    request({
      url: `${API_BASE_URL}/api/project/fetch`,
      method: "GET",
    })
      .then((response) => {
        console.log("Projects API response:", response);
        if (response.projects && Array.isArray(response.projects)) {
          setProjects(response.projects);
        } else {
          console.error("Expected an array but got:", response);
          setProjects([]); // Set to an empty array if the response is not as expected
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setProjects([]); // Set to an empty array in case of error
      });
  };

  const fetchProjectDetails = (projectId) => {
    request({
      url: `${API_BASE_URL}/api/project/${projectId}/members`,
      method: "GET",
    })
      .then((response) => {
        setMembers(response);
      })
      .catch((error) => {
        console.error("Error fetching project members:", error);
        setMembers([]);
      });

    request({
      url: `${API_BASE_URL}/api/project/${projectId}/sprints`,
      method: "GET",
    })
      .then((response) => {
        setSprints(response);
      })
      .catch((error) => {
        console.error("Error fetching project sprints:", error);
        setSprints([]);
      });
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setEditRetrospectiveRequest({
      ...editRetrospectiveRequest,
      projectId,
      fromId: "",
      toId: "",
      sprintId: "",
    });
    if (projectId) {
      fetchProjectDetails(projectId);
      setDropdownDisabled(false);
    } else {
      setMembers([]);
      setSprints([]);
      setDropdownDisabled(true);
    }
  };

  const handleUserInput = (e) => {
    setEditRetrospectiveRequest({
      ...editRetrospectiveRequest,
      [e.target.name]: e.target.value,
    });
  };

  const saveRetrospective = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    request({
      url: `${API_BASE_URL}/api/retrospective/edit/${id}`,
      method: "PUT",
      body: JSON.stringify(editRetrospectiveRequest),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((result) => {
        console.log("Retrospective updated successfully:", result);
        toast.success("Retrospective updated successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        navigate("/user/admin/retrospective/all");
      })
      .catch((error) => {
        console.error("Error updating retrospective:", error);
        toast.error("Failed to update retrospective. Please try again.", {
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
                        <h1>Edit Retrospective</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Edit Retrospective
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
                        value={editRetrospectiveRequest.status}
                      >
                        <option value="Start">Start</option>
                        <option value="Continue">Continue</option>
                        <option value="Stop">Stop</option>
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
                        value={editRetrospectiveRequest.projectId}
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
                        value={editRetrospectiveRequest.fromId}
                        required
                        disabled={dropdownDisabled}
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
                        value={editRetrospectiveRequest.toId}
                        required
                        disabled={dropdownDisabled}
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
                        value={editRetrospectiveRequest.sprintId}
                        required
                        disabled={dropdownDisabled}
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
                        value={editRetrospectiveRequest.description}
                      ></textarea>
                    </div>
                  </div>
                  <div className="card-footer">
                    <input
                      type="submit"
                      className="btn float-right"
                      value="Update Retrospective"
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
      <ToastContainer />
    </div>
  );
};

export default EditRetrospective;
