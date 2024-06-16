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
    deadlineDate: "",
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
    formData.append("deadlineDate", addProjectRequest.deadlineDate);

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

                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Project Deadline
                      </label>
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
