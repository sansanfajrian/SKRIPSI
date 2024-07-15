import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewDetailBacklog = () => {
  const { id } = useParams();

  const [backlogDetails, setBacklogDetails] = useState({
    code: "",
    name: "",
    notes: "",
    estEffort: 0,
    addEffort: 0,
    actEffort: 0,
    prog: 0,
    status: "",
    startDate: "",
    planEndDate: "",
    doneDate: null,
    plannedPicId: "",
    rlzPicId: null,
    documents: [],
    storyId: "",
    sprintId: "",
    projectId: ""
  });

  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [stories, setStories] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchBacklogDetails();
    fetchProjects();
  }, []);

  const fetchBacklogDetails = () => {
    request({
      url: API_BASE_URL + `/api/backlog/get/${id}`,
      method: "GET",
    }).then((response) => {
      setBacklogDetails(response);
      fetchSprints(response.projectId);
      fetchStories(response.projectId);
      fetchMembers(response.projectId);
    }).catch((error) => {
      console.error("Error fetching backlog details:", error);
      toast.error("Failed to fetch backlog details. Please try again.", {
        position: "top-center",
        autoClose: 2000,
      });
    });
  };

  const fetchProjects = () => {
    request({
      url: API_BASE_URL + "/api/project/fetch",
      method: "GET",
    }).then((response) => {
      if (response.projects && Array.isArray(response.projects)) {
        setProjects(response.projects);
      } else {
        console.error("Expected an array of projects but got:", response);
        setProjects([]);
      }
    }).catch((error) => {
      console.error("Error fetching projects:", error);
      setProjects([]);
    });
  };

  const fetchSprints = (projectId) => {
    request({
      url: API_BASE_URL + `/api/project/${projectId}/sprints`,
      method: "GET",
    }).then((response) => {
      if (response && Array.isArray(response)) {
        setSprints(response);
      } else {
        console.error("Expected an array of sprints but got:", response);
        setSprints([]);
      }
    }).catch((error) => {
      console.error("Error fetching sprints:", error);
      setSprints([]);
    });
  };

  const fetchStories = (projectId) => {
    request({
      url: API_BASE_URL + `/api/project/${projectId}/stories`,
      method: "GET",
    }).then((response) => {
      if (response && Array.isArray(response)) {
        setStories(response);
      } else {
        console.error("Expected an array of stories but got:", response);
        setStories([]);
      }
    }).catch((error) => {
      console.error("Error fetching stories:", error);
      setStories([]);
    });
  };

  const fetchMembers = (projectId) => {
    request({
      url: API_BASE_URL + `/api/project/${projectId}/members`,
      method: "GET",
    }).then((response) => {
      if (response && Array.isArray(response)) {
        setMembers(response);
      } else {
        console.error("Expected an array of members but got:", response);
        setMembers([]);
      }
    }).catch((error) => {
      console.error("Error fetching members:", error);
      setMembers([]);
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
                        <h1>Backlog Item Details</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Backlog Item Details
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="code" className="form-label">Task Code</label>
                    <input
                      type="text"
                      className="form-control"
                      id="code"
                      name="code"
                      value={backlogDetails.code}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Task Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={backlogDetails.name}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">Notes</label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      value={backlogDetails.notes}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="estEffort" className="form-label">Estimated Effort</label>
                    <input
                      type="number"
                      className="form-control"
                      id="estEffort"
                      name="estEffort"
                      value={backlogDetails.estEffort}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="addEffort" className="form-label">Additional Effort</label>
                    <input
                      type="number"
                      className="form-control"
                      id="addEffort"
                      name="addEffort"
                      value={backlogDetails.addEffort}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="actEffort" className="form-label">Actual Effort</label>
                    <input
                      type="number"
                      className="form-control"
                      id="actEffort"
                      name="actEffort"
                      value={backlogDetails.actEffort}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="prog" className="form-label">Progress (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="prog"
                      name="prog"
                      value={backlogDetails.prog}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <input
                      type="text"
                      className="form-control"
                      id="status"
                      name="status"
                      value={backlogDetails.status}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      name="startDate"
                      value={backlogDetails.startDate}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="planEndDate" className="form-label">Planned End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="planEndDate"
                      name="planEndDate"
                      value={backlogDetails.planEndDate}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="doneDate" className="form-label">Done Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="doneDate"
                      name="doneDate"
                      value={backlogDetails.doneDate}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="projectId" className="form-label">Project</label>
                    <select
                      className="form-select"
                      id="projectId"
                      name="projectId"
                      value={backlogDetails.projectId}
                      disabled
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
                    <label htmlFor="plannedPicId" className="form-label">Planned PIC </label>
                    <select
                      className="form-select"
                      id="plannedPicId"
                      name="plannedPicId"
                      value={backlogDetails.plannedPicId}
                      disabled
                    >
                      <option value="">Select Planned PIC </option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="rlzPicId" className="form-label">Release PIC </label>
                    <input
                      type="text"
                      className="form-control"
                      id="rlzPicId"
                      name="rlzPicId"
                      value={backlogDetails.rlzPicId}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Backlog Documents
                    </label>
                    <ul className="nav flex-column">
                      {backlogDetails.documents.map((doc, index) => (
                        <li className="nav-item" key={index}>
                          <a href={doc.presignedUrl} target="_blank" rel="noreferrer">{doc.name} - {doc.httpContentType}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="mb-3">
                    <label htmlFor="storyId" className="form-label">Story</label>
                    <select
                      className="form-select"
                      id="storyId"
                      name="storyId"
                      value={backlogDetails.storyId}
                      disabled
                    >
                      <option value="">Select Story</option>
                      {stories.map((story) => (
                        <option key={story.storyId} value={story.storyId}>
                          {story.storyName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="sprintId" className="form-label">Sprint</label>
                    <select
                      className="form-select"
                      id="sprintId"
                      name="sprintId"
                      value={backlogDetails.sprintId}
                      disabled
                    >
                      <option value="">Select Sprint</option>
                      {sprints.map((sprint) => (
                        <option key={sprint.sprintId} value={sprint.sprintId}>
                          {sprint.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewDetailBacklog;