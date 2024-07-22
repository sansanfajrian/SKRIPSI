import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const EditIssue = () => {
  const [issue, setIssue] = useState({
    status: "Open",
    code: "",
    title: "",
    description: "",
    issuedDate: new Date().toISOString().split("T")[0],
    issuer: "",
    projectId: "",
    issuerId: "",
    assigneeId: "",
    sprintId: "",
    backlogId: "",
    closedDate: "",
  });
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [backlogs, setBacklogs] = useState([]);
  const [dropdownDisabled, setDropdownDisabled] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams(); // Get issue id from route parameters

  useEffect(() => {
    // Fetch projects for dropdown
    request({
      url: API_BASE_URL + "/api/project/fetch/",
      method: "GET",
    }).then((response) => {
      if (response.projects && Array.isArray(response.projects)) {
        setProjects(response.projects);
      } else {
        console.error("Expected an array but got:", response);
        setProjects([]);
      }
    }).catch((error) => {
      console.error("Error fetching projects:", error);
      setProjects([]);
    });

    // Fetch issue details by ID
    request({
      url: `${API_BASE_URL}/api/issue/get/${id}`,
      method: "GET",
    }).then((response) => {
      if (response) {
        setIssue(response);
        fetchProjectDetails(response.projectId); // Fetch related data based on projectId
      }
    }).catch((error) => {
      console.error("Error fetching issue:", error);
    });

    // Fetch current user ID for issuer
    request({
      url: API_BASE_URL + "/api/user/me",
      method: "GET",
    }).then((response) => {
      setIssue((prevState) => ({
        ...prevState,
        issuerId: response.id,
        issuer: response.name,
      }));
    }).catch((error) => {
      console.error("Error fetching current user:", error);
    });
  }, [id]);

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

    request({
      url: `${API_BASE_URL}/api/project/${projectId}/backlog`,
      method: "GET",
    }).then((response) => {
      setBacklogs(response);
    }).catch((error) => {
      console.error("Error fetching project backlogs:", error);
      setBacklogs([]);
    });
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setIssue({
      ...issue,
      projectId,
      assigneeId: "",
      sprintId: "",
      backlogId: "",
    });
    if (projectId) {
      fetchProjectDetails(projectId);
      setDropdownDisabled(false);
    } else {
      setMembers([]);
      setSprints([]);
      setBacklogs([]);
      setDropdownDisabled(true);
    }
  };

  const handleUserInput = (e) => {
    setIssue({
      ...issue,
      [e.target.name]: e.target.value,
    });
  };

  const saveIssue = (e) => {
    e.preventDefault();

    // Convert assigneeId, sprintId, backlogId to integers before sending
    const issueRequest = {
      ...issue,
      assigneeId: parseInt(issue.assigneeId),
      sprintId: parseInt(issue.sprintId),
      backlogId: parseInt(issue.backlogId),
    };

    const accessToken = localStorage.getItem('accessToken');
    request({
      url: API_BASE_URL + "/api/issue/edit/" + id,
      method: "PUT",
      body: JSON.stringify(issueRequest),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
      },
    }).then((result) => {
      if (result) {
        toast.success("Issue updated successfully", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate("/user/admin/issue/all");
        }, 1000);
      } else {
        toast.error("Error updating issue", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    }).catch(error => {
      console.error("Error:", error);
      toast.error("Failed to update issue. Please try again.", {
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
                        <h1>Edit Issue</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Edit Issue
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={saveIssue}>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="code" className="form-label">
                        Issue Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="code"
                        name="code"
                        onChange={handleUserInput}
                        value={issue.code}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        Issue Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        onChange={handleUserInput}
                        value={issue.title}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Issue Description
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="4"
                        onChange={handleUserInput}
                        value={issue.description}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="issuedDate" className="form-label">
                        Issued Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="issuedDate"
                        name="issuedDate"
                        onChange={handleUserInput}
                        value={issue.issuedDate}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="issuer" className="form-label">
                        Issuer
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="issuer"
                        name="issuer"
                        onChange={handleUserInput}
                        value={issue.issuer}
                        required
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        id="status"
                        className="form-select"
                        name="status"
                        onChange={handleUserInput}
                        value={issue.status}
                        required
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Fixed">Fixed</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="projectId" className="form-label">
                        Project
                      </label>
                      <select
                        id="projectId"
                        className="form-select"
                        name="projectId"
                        onChange={handleProjectChange}
                        value={issue.projectId}
                        required
                      >
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="assigneeId" className="form-label">
                        Assignee
                      </label>
                      <select
                        id="assigneeId"
                        className="form-select"
                        name="assigneeId"
                        onChange={handleUserInput}
                        value={issue.assigneeId}
                        disabled={dropdownDisabled}
                      >
                        <option value="">Select Assignee</option>
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
                        id="sprintId"
                        className="form-select"
                        name="sprintId"
                        onChange={handleUserInput}
                        value={issue.sprintId}
                        disabled={dropdownDisabled}
                      >
                        <option value="">Select Sprint</option>
                        {sprints.map((sprint) => (
                          <option key={sprint.sprintId} value={sprint.sprintId}>
                            {sprint.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="backlogId" className="form-label">
                        Backlog
                      </label>
                      <select
                        id="backlogId"
                        className="form-select"
                        name="backlogId"
                        onChange={handleUserInput}
                        value={issue.backlogId}
                        disabled={dropdownDisabled}
                      >
                        <option value="">Select Backlog</option>
                        {backlogs.map((backlog) => (
                          <option key={backlog.backlogId} value={backlog.backlogId}>
                            {backlog.code} - {backlog.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="closedDate" className="form-label">
                        Closed Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="closedDate"
                        name="closedDate"
                        onChange={handleUserInput}
                        value={issue.closedDate}
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
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

export default EditIssue;
