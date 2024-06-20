import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { request } from "../util/APIUtils";
import { API_BASE_URL } from "../constants";

const AddProject = () => {
  const [addProjectRequest, setAddProjectRequest] = useState({
    name: "",
    description: "",
    requirement: "",
    startDate: "",
    startTime: "08:00",
    deadlineDate: "",
    deadlineTime: "08:00",
    reminderEmail: 0,
    reminderPopup: 0,
  });
  const [documents, setDocuments] = useState([]);

  const navigate = useNavigate();

  const handleUserInput = (e) => {
    setAddProjectRequest({
      ...addProjectRequest,
      [e.target.name]: e.target.value,
    });
  };

  const saveProject = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", addProjectRequest.name);
    formData.append("description", addProjectRequest.description);
    formData.append("requirement", addProjectRequest.requirement);
    formData.append("startDate", addProjectRequest.startDate);
    formData.append("startTime", addProjectRequest.startTime);
    formData.append("deadlineDate", addProjectRequest.deadlineDate);
    formData.append("deadlineTime", addProjectRequest.deadlineTime);
    formData.append("reminderEmail", addProjectRequest.reminderEmail);
    formData.append("reminderPopup", addProjectRequest.reminderPopup);

    [...documents].forEach((documents, i) => {
      formData.append("documents", documents, documents.name);
    });

    request({
      url: API_BASE_URL + "/api/project/add",
      method: "POST",
      body: formData,
    }).then((result) => {
      if (result.success) {
        console.log("Got the success response");

        toast.success(result.responseMessage, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate("/user/admin/project/all");
        }, 1000); // Redirect after 3 seconds
      } else {
        console.log("Didn't got success response");
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 1000); // Redirect after 3 seconds
      }
    });
  };

  const handleOnSelectTimePopupReminder = (e, field) => {
    setAddProjectRequest({
      ...addProjectRequest,
      [field]: e.target.value,
    });
  }

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
                        <h1>Add Project</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol
                          className="breadcrumb float-sm-right"
                          style={{ backgroundColor: "transparent" }}
                        >
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Add Project
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={saveProject}>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Project Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Masukkan nama projek"
                        name="name"
                        onChange={handleUserInput}
                        value={addProjectRequest.name}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Project Description
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows="3"
                        name="description"
                        placeholder="Masukkan deskripsi projek"
                        onChange={handleUserInput}
                        value={addProjectRequest.description}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Project Requirement
                      </label>
                      <textarea
                        className="form-control"
                        id="requirement"
                        rows="3"
                        name="requirement"
                        placeholder="Masukkan persyaratan projek"
                        onChange={handleUserInput}
                        value={addProjectRequest.requirement}
                      />
                    </div>

                    <hr />

                    <h5>Timeline</h5>

                    <div className="row">
                      <div className="col-sm-6">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            Start
                          </label>

                          <div className="row">
                            <div className="col-sm-8">
                              <input
                                type="date"
                                className="form-control"
                                id="startDate"
                                placeholder="select start date.."
                                name="startDate"
                                onChange={handleUserInput}
                                value={addProjectRequest.startDate}
                              />
                            </div>
                            <div className="col-sm-4">
                              <input
                                type="time"
                                className="form-control"
                                id="startTime"
                                placeholder="select start time.."
                                name="startTime"
                                onChange={handleUserInput}
                                value={addProjectRequest.startTime}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            Deadline
                          </label>

                          <div className="row">
                            <div className="col-sm-8">
                              <input
                                type="date"
                                className="form-control"
                                id="deadlineDate"
                                placeholder="select deadline date.."
                                name="deadlineDate"
                                onChange={handleUserInput}
                                value={addProjectRequest.deadlineDate}
                              />
                            </div>
                            <div className="col-sm-4">
                              <input
                                type="time"
                                className="form-control"
                                id="deadlineTime"
                                placeholder="select deadline date.."
                                name="deadlineTime"
                                onChange={handleUserInput}
                                value={addProjectRequest.deadlineTime}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr />

                    <h5>
                      Deadline Reminders <small>(in minutes before deadline)</small>
                    </h5>

                    <div className="row">
                      <div className="col-sm-3">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            With Email
                          </label>

                          <div className="row">
                            <div className="col-md-6">
                              <input
                                type="number"
                                className="form-control"
                                id="reminderEmail"
                                name="reminderEmail"
                                onChange={handleUserInput}
                                value={addProjectRequest.reminderEmail}
                              />
                            </div>
                            <div className="col-md-6">
                              <select className="form-control" onChange={(e) => handleOnSelectTimePopupReminder(e, 'reminderEmail')}>
                                <option value={0}>-- Select Time --</option>
                                <option value={10}>10 minutes before</option>
                                <option value={15}>15 minutes before</option>
                                <option value={30}>30 minutes before</option>
                                <option value={60}>1 hour before</option>
                                <option value={1 * 24 * 60}>1 day before</option>
                                <option value={2 * 24 * 60}>2 days before</option>
                                <option value={7 * 24 * 60}>1 week before</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-3">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            With Popup
                          </label>

                          <div className="row">
                            <div className="col-md-6">
                              <input
                                type="number"
                                className="form-control"
                                id="reminderPopup"
                                name="reminderPopup"
                                onChange={handleUserInput}
                                value={addProjectRequest.reminderPopup}
                              />
                            </div>
                            <div className="col-md-6">
                            <select className="form-control" onChange={(e) => handleOnSelectTimePopupReminder(e, 'reminderPopup')}>
                                <option value={0}>-- Select Time --</option>
                                <option value={10}>10 minutes before</option>
                                <option value={15}>15 minutes before</option>
                                <option value={30}>30 minutes before</option>
                                <option value={60}>1 hour before</option>
                                <option value={1 * 24 * 60}>1 day before</option>
                                <option value={2 * 24 * 60}>2 days before</option>
                                <option value={7 * 24 * 60}>1 week before</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Project Documents
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
                                <li className="nav-item" key={index}>
                                  {file.name} - {file.type}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="card-footer">
                    <input
                      type="submit"
                      className="btn float-right"
                      value="Add Project"
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

export default AddProject;
