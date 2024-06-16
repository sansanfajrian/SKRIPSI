import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { request } from "../util/APIUtils";
import { API_BASE_URL } from "../constants";

const EditProject = () => {
  const [editProjectRequest, setEditProjectRequest] = useState({
    id: 0,
    name: "",
    description: "",
    requirement: "",
    deadlineDate: "",
    documents: [],
  });
  const [documents, setDocuments] = useState([]);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    let { id, name, description, requirement, deadlineDate, documents } =
      location.state;
    setEditProjectRequest({
      id,
      name,
      description,
      requirement,
      deadlineDate,
      documents,
    });
  }, []);

  const handleUserInput = (e) => {
    setEditProjectRequest({
      ...editProjectRequest,
      [e.target.name]: e.target.value,
    });
  };

  const removeExistingDocument = (e, document) => {
    e.preventDefault();

    document.deleted = !document.deleted;

    setEditProjectRequest({ ...editProjectRequest });
  };

  const saveProject = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", editProjectRequest.id);
    formData.append("name", editProjectRequest.name);
    formData.append("description", editProjectRequest.description);
    formData.append("requirement", editProjectRequest.requirement);
    formData.append("deadlineDate", editProjectRequest.deadlineDate);
    formData.append(
      "deletedDocumentIds",
      editProjectRequest.documents
        .filter((doc) => doc.deleted)
        .map((doc) => doc.id)
    );

    [...documents].forEach((documents, i) => {
      formData.append("documents", documents, documents.name);
    });

    request({
      url: API_BASE_URL + "/api/project/update",
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
                        <h1>Edit Project</h1>
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
                            Edit Project
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
                        value={editProjectRequest.name}
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
                        value={editProjectRequest.description}
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
                        value={editProjectRequest.requirement}
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
                        value={editProjectRequest.deadlineDate}
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

                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Existing Documents
                      </label>
                      <div className="row">
                        <div className="col-md-6">
                          {editProjectRequest.documents.length === 0 &&
                            documents.length === 0 && (
                              <i>This project has no documents uploaded</i>
                            )}

                          <ul className="nav flex-column">
                            {[...editProjectRequest.documents]?.map(
                              (doc, index) => (
                                <li
                                  className={`nav-item ${
                                    doc.deleted
                                      ? "text-decoration-line-through"
                                      : ""
                                  }`}
                                  key={index}
                                >
                                  <a
                                    href={doc.presignedUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {doc.name} - {doc.httpContentType}
                                  </a>
                                  <span
                                    className={`float-right btn btn-sm ${
                                      doc.deleted ? "btn-success" : "btn-danger"
                                    }`}
                                    onClick={(e) =>
                                      removeExistingDocument(e, doc)
                                    }
                                  >
                                    <i
                                      className={`fa ${
                                        doc.deleted ? "fa-check" : "fa-trash"
                                      }`}
                                    ></i>
                                  </span>
                                </li>
                              )
                            )}

                            {[...documents].map((doc, index) => (
                              <li className="nav-item" key={index}>
                                {doc.name} - {doc.type}{" "}
                                <span className="badge badge-success ">
                                  new
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <input
                      type="submit"
                      className="btn float-right"
                      value="Save Data"
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

export default EditProject;
