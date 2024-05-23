import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const EditProject = () => {
  const [editProjectRequest, setEditProjectRequest] = useState({
    name: "",
    description: "",
    requirement: "",
    deadlineDate: "",
  });

  const location = useLocation();
  const project = location.state;

  const navigate = useNavigate();

  const handleUserInput = (e) => {
    setEditProjectRequest({
      ...editProjectRequest,
      [e.target.name]: e.target.value,
    });
  };

  const saveProject = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/project/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editProjectRequest),
    }).then((result) => {
      console.log("result", result);
      result.json().then((res) => {
        console.log(res);

        if (res.success) {
          console.log("Got the success response");

          toast.success(res.responseMessage, {
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
    });
  };

  return (
    <div className="content-wrapper">

      <section className="content-header">
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div
                className="card form-card ms-2 me-2 mb-5 custom-bg border-color"
                style={{
                  height: "45rem",
                }}
              >
                <div className="card-header">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-6">
                        <h1>Edit Project</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{backgroundColor: 'transparent'}}>
                          <li className="breadcrumb-item" ><a href="#">Home</a></li>
                          <li className="breadcrumb-item active">Edit Project</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <form onSubmit={saveProject}>
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
                        value={project.name}
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
                        value={project.description}
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
                        value={project.requirement}
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
                        value={project.deadlineDate}
                      />
                    </div>

                    <input
                      type="submit"
                      className="btn float-right"
                      value="Edit Project"
                      style={{backgroundColor: "#3393df", color: "white", fontWeight: "bold"}}
                    />

                    <ToastContainer />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditProject;