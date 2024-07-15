import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewDetailSprint = () => {
  const { id } = useParams(); // Ambil ID sprint dari URL
  const [sprintDetails, setSprintDetails] = useState({
    name: "",
    startDate: "",
    endDate: "",
    projectId: ""
  });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Ambil data sprint dari backend
    request({
      url: API_BASE_URL + `/api/sprint/get/${id}`,
      method: "GET",
    }).then((response) => {
      console.log("Sprint API response:", response); // Log response
      // Set nilai form dengan data sprint yang diterima
      setSprintDetails({
        name: response.name,
        startDate: response.startDate,
        endDate: response.endDate,
        projectId: response.projectId
      });
    }).catch((error) => {
      console.error("Error fetching sprint:", error);
    });

    // Ambil daftar proyek untuk dropdown
    request({
      url: API_BASE_URL + "/api/project/fetch",
      method: "GET",
    }).then((response) => {
      console.log("Projects API response:", response); // Log response
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
  }, [id]);  // Tambahkan id ke dependency array untuk reload saat id berubah

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
                        <h1>View Sprint Details</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            View Sprint Details
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <form>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Sprint Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter sprint name"
                        name="name"
                        value={sprintDetails.name}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="startDate" className="form-label">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        name="startDate"
                        value={sprintDetails.startDate}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="endDate" className="form-label">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="endDate"
                        name="endDate"
                        value={sprintDetails.endDate}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="projectId" className="form-label">
                        Project
                      </label>
                      <select
                        className="form-control"
                        id="projectId"
                        name="projectId"
                        value={sprintDetails.projectId}
                        disabled
                      >
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button
                      type="button"
                      className="btn float-right"
                      onClick={() => window.history.back()}
                      style={{
                        backgroundColor: "#3393df",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Back
                    </button>
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

export default ViewDetailSprint;
