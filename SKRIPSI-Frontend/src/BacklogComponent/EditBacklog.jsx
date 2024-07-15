import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const EditBacklog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log(id);
  const [editBacklogRequest, setEditBacklogRequest] = useState({
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
  const [documents, setDocuments] = useState([]);
  const [disabledDropdowns, setDisabledDropdowns] = useState(true); 

  useEffect(() => {
    fetchBacklogDetails();
    fetchProjects();
  }, []);

  const fetchBacklogDetails = () => {
    request({
      url: API_BASE_URL + `/api/backlog/get/${id}`,
      method: "GET",
    }).then((response) => {
      setEditBacklogRequest(response);
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
  
  const removeExistingDocument = (e, document) => {
    e.preventDefault();

    document.deleted = !document.deleted;

    setEditBacklogRequest({...editBacklogRequest});
  }

  useEffect(() => {
    if (editBacklogRequest.projectId) {
      fetchSprints();
      fetchStories();
      fetchMembers();
      setDisabledDropdowns(false);
    } else {
      setDisabledDropdowns(true);
    }
  }, [editBacklogRequest.projectId]);

  const fetchSprints = () => {
    request({
      url: API_BASE_URL + `/api/project/${editBacklogRequest.projectId}/sprints`,
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

  const fetchStories = () => {
    request({
      url: API_BASE_URL + `/api/project/${editBacklogRequest.projectId}/stories`,
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

  const fetchMembers = () => {
    request({
      url: API_BASE_URL + `/api/project/${editBacklogRequest.projectId}/members`,
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

  const handleUserInput = (e) => {
    setEditBacklogRequest({
      ...editBacklogRequest,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    let tempDocuments = [];
    for (let i = 0; i < files.length; i++) {
      tempDocuments.push(files[i]);
    }
    setEditBacklogRequest({
      ...editBacklogRequest,
      documents: tempDocuments,
    });
  };

  const saveBacklog = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("code", editBacklogRequest.code);
    formData.append("name", editBacklogRequest.name);
    formData.append("notes", editBacklogRequest.notes);
    formData.append("estEffort", editBacklogRequest.estEffort);
    formData.append("status", editBacklogRequest.status);
    formData.append("startDate", editBacklogRequest.startDate);
    formData.append("planEndDate", editBacklogRequest.planEndDate);
    formData.append("plannedPicId", editBacklogRequest.plannedPicId);
    formData.append("storyId", editBacklogRequest.storyId);
    formData.append("sprintId", editBacklogRequest.sprintId);
    formData.append("projectId", editBacklogRequest.projectId);
    
    const deletedDocumentIds = editBacklogRequest.documents
    .filter(doc => doc.deleted)
    .map(doc => doc.id);
    formData.append("deletedDocumentIds", deletedDocumentIds);

    // Handle new documents
    if (documents && documents.length > 0) {
        for (let i = 0; i < documents.length; i++) {
        formData.append('documents', documents[i]);
        }
    }

    const accessToken = localStorage.getItem('accessToken');

    console.log(editBacklogRequest);
    console.log(deletedDocumentIds);

    fetch(API_BASE_URL + `/api/backlog/edit/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + accessToken,
      },
      body: formData,
    }).then((result) => {
        console.log("result", result);
        result.json().then((res) => {
            console.log(res);
            if (res.success) {
                toast.success("Backlog updated successfully", {
                  position: "top-center",
                  autoClose: 1000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                setTimeout(() => {
                  navigate("/user/admin/backlog/all");
                }, 1000);
            } else {
                toast.error("Error updating backlog "+res.message, {
                  position: "top-center",
                  autoClose: 1000,
                });
            }
        });
    }).catch(error => {
      console.error("Error:", error);
      toast.error("Failed to update backlog. Please try again.", {
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
                        <h1>Edit Backlog Item</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Edit Backlog Item
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={saveBacklog}>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="code" className="form-label">Task Code</label>
                      <input
                        type="text"
                        className="form-control"
                        id="code"
                        name="code"
                        onChange={handleUserInput}
                        value={editBacklogRequest.code}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Task Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        onChange={handleUserInput}
                        value={editBacklogRequest.name}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="notes" className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        id="notes"
                        name="notes"
                        onChange={handleUserInput}
                        value={editBacklogRequest.notes}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="estEffort" className="form-label">Estimated Effort</label>
                      <input
                        type="number"
                        className="form-control"
                        id="estEffort"
                        name="estEffort"
                        onChange={handleUserInput}
                        value={editBacklogRequest.estEffort}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="addEffort" className="form-label">Additional Effort</label>
                      <input
                        type="number"
                        className="form-control"
                        id="addEffort"
                        name="addEffort"
                        value={0}
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
                        value={0}
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
                        value={0}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select
                        className="form-select"
                        id="status"
                        name="status"
                        onChange={handleUserInput}
                        value={editBacklogRequest.status}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                        <option value="Hold">Hold</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="startDate" className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        name="startDate"
                        onChange={handleUserInput}
                        value={editBacklogRequest.startDate}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="planEndDate" className="form-label">Planned End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="planEndDate"
                        name="planEndDate"
                        onChange={handleUserInput}
                        value={editBacklogRequest.planEndDate}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="doneDate" className="form-label">Done Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="doneDate"
                        name="doneDate"
                        onChange={handleUserInput}
                        value={editBacklogRequest.doneDate}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="projectId" className="form-label">Project</label>
                      <select
                        className="form-select"
                        id="projectId"
                        name="projectId"
                        onChange={handleUserInput}
                        value={editBacklogRequest.projectId}
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
                      <label htmlFor="plannedPicId" className="form-label">Planned PIC </label>
                      <select
                        className="form-select"
                        id="plannedPicId"
                        name="plannedPicId"
                        onChange={handleUserInput}
                        value={editBacklogRequest.plannedPicId}
                        disabled={disabledDropdowns} // Disable dropdown if no project is selected
                        required
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
                        value={null}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Backlog Documents
                        </label>
                        <input
                          type="file"
                          multiple
                          className="form-control"
                          id="documents"
                          placeholder="Upload documents"
                          name="documents"
                          onChange={(e) => setDocuments(e.target.files)}
                        ></input>
                     </div>

                     <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Existing Documents
                        </label>
                        <div className="row">
                            <div className="col-md-6">
                            {(editBacklogRequest.documents.length === 0 && documents.length === 0) && (<i>This project has no documents uploaded</i>)}

                            <ul className="nav flex-column">
                                {[...editBacklogRequest.documents].map((doc, index) => (
                                <li className={`nav-item ${doc.deleted ? 'text-decoration-line-through' : ''}`} key={index}>
                                    <a href={doc.presignedUrl} target="_blank" rel="noreferrer">{doc.name} - {doc.httpContentType}</a>
                                    <span className={`float-right btn btn-sm ${doc.deleted ? 'btn-success' : 'btn-danger'}`} onClick={(e) => removeExistingDocument(e, doc)}>
                                    <i className={`fa ${doc.deleted ? 'fa-check' : 'fa-trash'}`}></i>
                                    </span>
                                </li>
                                ))}

                                {/* {[...documents].map((doc, index) => (
                                <li className="nav-item" key={index}>
                                    {doc.name} - {doc.type} <span className="badge badge-success">new</span>
                                </li>
                                ))} */}
                            </ul>
                            </div>
                        </div>
                    </div>

                    {documents.length > 0 && (
                      <div className="mb-3">
                        <div className="row">
                          <div className="col-md-6">
                            <ul className="nav flex-column">
                              {[...documents].map((file, index) => (
                                <li className="nav-item" key={index}>{file.name} - {file.type}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="card-footer">
                    <div className="mb-3">
                      <label htmlFor="storyId" className="form-label">Story</label>
                      <select
                        className="form-select"
                        id="storyId"
                        name="storyId"
                        onChange={handleUserInput}
                        value={editBacklogRequest.storyId}
                        disabled={disabledDropdowns} // Disable dropdown if no project is selected
                        required
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
                        onChange={handleUserInput}
                        value={editBacklogRequest.sprintId}
                        disabled={disabledDropdowns} // Disable dropdown if no project is selected
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
                  </div>
                  <div className="card-footer">
                    <input
                      type="submit"
                      className="btn float-right"
                      value="Edit Backlog"
                      style={{
                        backgroundColor: "#3393df",
                        color: "white",
                        fontWeight: "bold",
                      }}// Disable submit button when project is not selected
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

export default EditBacklog;
