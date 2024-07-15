import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const AddBacklog = () => {
  const [addBacklogRequest, setAddBacklogRequest] = useState({
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
  const [disabledDropdowns, setDisabledDropdowns] = useState(true); // State to manage disabled state of dropdowns
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch projects
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
  }, []);

  useEffect(() => {
    if (addBacklogRequest.projectId) {
      // Fetch sprints
      request({
        url: API_BASE_URL + `/api/project/${addBacklogRequest.projectId}/sprints`,
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

      // Fetch stories
      request({
        url: API_BASE_URL + `/api/project/${addBacklogRequest.projectId}/stories`,
        method: "GET",
      }).then((response) => {
        console.log(response);
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

      // Fetch members
      request({
        url: API_BASE_URL + `/api/project/${addBacklogRequest.projectId}/members`,
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

      // Enable dropdowns after fetching data
      setDisabledDropdowns(false);
    } else {
      // Disable dropdowns if no project is selected
      setDisabledDropdowns(true);
    }
  }, [addBacklogRequest.projectId]);

  const handleUserInput = (e) => {
    setAddBacklogRequest({
      ...addBacklogRequest,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    let tempDocuments = [];
    for (let i = 0; i < files.length; i++) {
      tempDocuments.push(files[i]);
    }
    setDocuments(tempDocuments);
  };

  const saveBacklog = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("code", addBacklogRequest.code);
    formData.append("name", addBacklogRequest.name);
    formData.append("notes", addBacklogRequest.notes);
    formData.append("estEffort", addBacklogRequest.estEffort);
    formData.append("status", addBacklogRequest.status);
    formData.append("startDate", addBacklogRequest.startDate);
    formData.append("planEndDate", addBacklogRequest.planEndDate);
    formData.append("plannedPicId", addBacklogRequest.plannedPicId);
    formData.append("storyId", addBacklogRequest.storyId);
    formData.append("sprintId", addBacklogRequest.sprintId);
    formData.append("projectId", addBacklogRequest.projectId);

    [...documents].forEach((documents, i) => {
        formData.append('documents', documents, documents.name)
      })

    const accessToken = localStorage.getItem('accessToken');
    console.log(addBacklogRequest);
    console.log(formData);

    fetch(API_BASE_URL + "/api/backlog/add", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + accessToken
      },
      body: formData,
    }).then((result) => {
        console.log("result", result);
        result.json().then((res) => {
            console.log(res);
            if (res.success) {
                toast.success("Backlog created successfully", {
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
                toast.error("Error creating backlog "+ res.message, {
                  position: "top-center",
                  autoClose: 1000,
                });
            }
        });
    }).catch(error => {
        console.error("Error:", error);
        toast.error("Failed to add backlog. Please try again.", {
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
                        <h1>Add Backlog Item</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Add Backlog Item
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
                        value={addBacklogRequest.code}
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
                        value={addBacklogRequest.name}
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
                        value={addBacklogRequest.notes}
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
                        value={addBacklogRequest.estEffort}
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
                        value={addBacklogRequest.status}
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
                        value={addBacklogRequest.startDate}
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
                        value={addBacklogRequest.planEndDate}
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
                        value={addBacklogRequest.doneDate}
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
                        value={addBacklogRequest.projectId}
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
                        value={addBacklogRequest.plannedPicId}
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
                        value={addBacklogRequest.storyId}
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
                        value={addBacklogRequest.sprintId}
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
                      value="Add Backlog"
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
      <ToastContainer />
    </div>
  );
};

export default AddBacklog;
