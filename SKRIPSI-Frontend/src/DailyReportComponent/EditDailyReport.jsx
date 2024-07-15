import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const EditDailyReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editDailyReportRequest, setEditDailyReportRequest] = useState({
    taskDetails: "",
    notes: "",
    status: "To Do",
    addEffort: 0,
    actEffort: 0,
    estEffort: 0,
    acmAddEffort: 0,
    acmActEffort: 0,
    currTaskProgress: 0,
    initTaskProgress: 0,
    projectId: "",
    sprintId: "",
    backlogId: ""
  });

  const [projects, setProjects] = useState([]);
  const [backlogs, setBacklogs] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [dropdownDisabled, setDropdownDisabled] = useState(true);

  useEffect(() => {
    fetchDailyReport();
    fetchProjects();
  }, []);

  const fetchDailyReport = () => {
    request({
      url: `${API_BASE_URL}/api/dailyreport/get/${id}`,
      method: "GET",
    })
      .then((response) => {
        console.log("Daily Report API response:", response);
        const {
          taskDetails,
          notes,
          status,
          addEffort,
          actEffort,
          estEffort,
          acmAddEffort,
          acmActEffort,
          currTaskProgress,
          initTaskProgress,
          projectId,
          sprintId,
          backlogId
        } = response;
        setEditDailyReportRequest({
          taskDetails,
          notes,
          status,
          addEffort,
          actEffort,
          estEffort,
          acmAddEffort,
          acmActEffort,
          currTaskProgress,
          initTaskProgress,
          projectId,
          sprintId,
          backlogId
        });
        if (projectId) {
          fetchBacklogs(projectId);
          setDropdownDisabled(false);
        }
        if (projectId && backlogId) {
          fetchSprints(projectId, backlogId);
        }
      })
      .catch((error) => {
        console.error("Error fetching daily report:", error);
        toast.error("Failed to fetch daily report data. Please try again.", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };

  const fetchProjects = () => {
    request({
      url: API_BASE_URL + "/api/project/fetch/employee",
      method: "GET",
    })
      .then((response) => {
        console.log("Projects API response:", response);
        if (response.projects && Array.isArray(response.projects)) {
          setProjects(response.projects);
        } else {
          console.error("Expected an array but got:", response);
          setProjects([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setProjects([]);
      });
  };

  const fetchBacklogs = (projectId) => {
    request({
      url: `${API_BASE_URL}/api/project/${projectId}/backlog`,
      method: "GET",
    })
      .then((response) => {
        console.log("Backlogs API response:", response);
        if (response && Array.isArray(response)) {
          const formattedBacklogs = response.map((backlog) => ({
            backlogId: backlog.backlogId,
            name: `${backlog.code} :: ${backlog.name}`
          }));
          setBacklogs(formattedBacklogs);
        } else if (response && response.data && Array.isArray(response.data)) {
          const formattedBacklogs = response.data.map((backlog) => ({
            backlogId: backlog.backlogId,
            name: `${backlog.name} - ${backlog.code}`
          }));
          setBacklogs(formattedBacklogs);
        } else {
          console.error("Expected an array but got:", response);
          setBacklogs([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching project backlogs:", error);
        setBacklogs([]);
      });
  };
  const fetchSprints = (projectId, backlogId) => {
    request({
      url: `${API_BASE_URL}/api/sprint/${projectId}/backlog/${backlogId}/sprints`,
      method: "GET",
    })
      .then((response) => {
        console.log("Sprints API response:", response);
        if (response && Array.isArray(response)) {
          setSprints(response);
        } else if (response && response.data && Array.isArray(response.data)) {
          setSprints(response.data);
        } else {
          console.error("Expected an array but got:", response);
          setSprints([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching project sprints:", error);
        setSprints([]);
      });
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setEditDailyReportRequest({
      ...editDailyReportRequest,
      projectId,
      sprintId: "",
      backlogId: ""
    });
    if (projectId) {
      fetchBacklogs(projectId);
      setDropdownDisabled(false);
    } else {
      setBacklogs([]);
      setSprints([]);
      setDropdownDisabled(true);
    }
  };

  const handleBacklogChange = (e) => {
    const backlogId = e.target.value;
    setEditDailyReportRequest({
      ...editDailyReportRequest,
      backlogId,
      sprintId: ""
    });
    if (backlogId) {
      fetchSprints(editDailyReportRequest.projectId, backlogId);
    } else {
      setSprints([]);
    }
  };

  const handleUserInput = (e) => {
    setEditDailyReportRequest({
      ...editDailyReportRequest,
      [e.target.name]: e.target.value,
    });
  };

  const updateDailyReport = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    request({
      url: API_BASE_URL + `/api/dailyreport/update/${id}`,
      method: "PUT",
      body: JSON.stringify(editDailyReportRequest),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((result) => {
        if (result.success) {
          console.log(result);
          toast.success("Daily report updated successfully", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            navigate("/user/employee/dailyreport/all");
          }, 1000);
        } else {
          console.log(result);
          toast.error("Error updating daily report", {
            position: "top-center",
            autoClose: 1000,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to update daily report. Please try again.", {
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
                        <h1>Edit Daily Report</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Edit Daily Report
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={updateDailyReport}>
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
                        value={editDailyReportRequest.status}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                        <option value="Hold">Hold</option>
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
                        value={editDailyReportRequest.projectId}
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
                      <label htmlFor="backlogId" className="form-label">
                        Selected Task
                      </label>
                      <select
                        className="form-control"
                        id="backlogId"
                        name="backlogId"
                        onChange={handleBacklogChange}
                        value={editDailyReportRequest.backlogId}
                        disabled={dropdownDisabled}
                        required
                      >
                        <option value="">Select Backlog</option>
                        {backlogs.map((backlog) => (
                          <option key={backlog.backlogId} value={backlog.backlogId}>
                            {backlog.name}
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
                        value={editDailyReportRequest.sprintId}
                        required
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
                      <label htmlFor="taskDetails" className="form-label">
                        Task Details
                      </label>
                      <textarea
                        className="form-control"
                        id="taskDetails"
                        name="taskDetails"
                        rows="3"
                        onChange={handleUserInput}
                        value={editDailyReportRequest.taskDetails}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="notes" className="form-label">
                        Notes
                      </label>
                      <textarea
                        className="form-control"
                        id="notes"
                        name="notes"
                        rows="3"
                        onChange={handleUserInput}
                        value={editDailyReportRequest.notes}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="addEffort" className="form-label">
                        Additional Effort (hours)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="addEffort"
                        name="addEffort"
                        onChange={handleUserInput}
                        value={editDailyReportRequest.addEffort}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="actEffort" className="form-label">
                        Actual Effort (hours)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="actEffort"
                        name="actEffort"
                        onChange={handleUserInput}
                        value={editDailyReportRequest.actEffort}
                        required
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                      >
                        Update Daily Report
                      </button>
                    </div>
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

export default EditDailyReport;
