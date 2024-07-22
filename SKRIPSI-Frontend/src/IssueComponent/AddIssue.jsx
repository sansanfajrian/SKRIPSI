import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const AddIssue = () => {
  const [addIssueRequest, setAddIssueRequest] = useState({
    status: "Open", // Lock status to "Open"
    code: "", // New issue code field
    title: "", // New issue title field
    description: "", // Description field
    issuedDate: new Date().toISOString().split("T")[0], // Issued date field, default to today's date
    issuer: "", // Issuer field
    projectId: "",
    issuerId: "", // Default to current user ID
    assigneeId: "", // Change to string
    sprintId: "", // Change to string
    backlogId: "", // Change to string
    closedDate: "", // Default value, disabled
  });
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [backlogs, setBacklogs] = useState([]);
  const [dropdownDisabled, setDropdownDisabled] = useState(true); // State to disable dropdowns
  const navigate = useNavigate();

  useEffect(() => {
    request({
      url: API_BASE_URL + "/api/project/fetch/",
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

    // Fetch current user ID
    request({
      url: API_BASE_URL + "/api/user/me",
      method: "GET",
    }).then((response) => {
      setAddIssueRequest((prevState) => ({
        ...prevState,
        issuerId: response.id,
        issuer: response.name, // Set the issuer name
      }));
    }).catch((error) => {
      console.error("Error fetching current user:", error);
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
    setAddIssueRequest({
      ...addIssueRequest,
      projectId,
      assigneeId: "", // Reset to empty string
      sprintId: "", // Reset to empty string
      backlogId: "", // Reset to empty string
    });
    if (projectId) {
      fetchProjectDetails(projectId);
      setDropdownDisabled(false); // Enable dropdowns when project is selected
    } else {
      setMembers([]);
      setSprints([]);
      setBacklogs([]);
      setDropdownDisabled(true); // Disable dropdowns when no project is selected
    }
  };

  const handleUserInput = (e) => {
    setAddIssueRequest({
      ...addIssueRequest,
      [e.target.name]: e.target.value,
    });
  };

  const saveIssue = (e) => {
    e.preventDefault();

    // Convert assigneeId, sprintId, backlogId to integers before sending
    const issueRequest = {
      ...addIssueRequest,
      assigneeId: parseInt(addIssueRequest.assigneeId),
      sprintId: parseInt(addIssueRequest.sprintId),
      backlogId: parseInt(addIssueRequest.backlogId),
    };

    const accessToken = localStorage.getItem('accessToken');
    console.log(JSON.stringify(issueRequest));
    request({
      url: API_BASE_URL + "/api/issue/add",
      method: "POST",
      body: JSON.stringify(issueRequest),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
      },
    }).then((result) => {
      if (result) {
        toast.success("Issue created successfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate("/user/admin/issue/all");
        }, 1000);
      } else {
        console.log(result);
        toast.error("Error creating issue", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    }).catch(error => {
      console.error("Error:", error);
      toast.error("Failed to add issue. Please try again.", {
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
                        <h1>Add Issue</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Add Issue
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
                        value={addIssueRequest.code}
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
                        value={addIssueRequest.title}
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
                        value={addIssueRequest.description}
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
                        value={addIssueRequest.issuedDate}
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
                        value={addIssueRequest.issuer}
                        required
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="status"
                        name="status"
                        value={addIssueRequest.status}
                        required
                        disabled
                      />
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
                        value={addIssueRequest.projectId}
                        required
                      >
                        <option value="">Select a Project</option>
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
                        value={addIssueRequest.assigneeId}
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
                        value={addIssueRequest.sprintId}
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
                        value={addIssueRequest.backlogId}
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
                        value={addIssueRequest.closedDate}
                        disabled
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

export default AddIssue;
