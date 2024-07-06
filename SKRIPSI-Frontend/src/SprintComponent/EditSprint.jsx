import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const EditSprint = () => {
  const { id } = useParams(); // Ambil ID sprint dari URL
  const [editSprintRequest, setEditSprintRequest] = useState({
    name: "",
    startDate: "",
    endDate: "",
    projectId: ""
  });
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil data sprint yang akan diedit dari backend
    request({
      url: API_BASE_URL + `/api/sprint/get/${id}`,
      method: "GET",
    }).then((response) => {
      console.log("Sprint API response:", response); // Log response
      // Set nilai form dengan data sprint yang diterima
      setEditSprintRequest({
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

  const handleUserInput = (e) => {
    setEditSprintRequest({
      ...editSprintRequest,
      [e.target.name]: e.target.value,
    });
  };

  const updateSprint = (e) => {
    e.preventDefault();

    // Get the access token from your OAuth flow (localStorage, state, etc.)
    const accessToken = localStorage.getItem('accessToken'); // Example

    // Kirim perubahan sprint ke backend
    request({
      url: API_BASE_URL + `/api/sprint/edit/${id}`,
      method: "PUT",
      body: JSON.stringify(editSprintRequest),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
      },
    }).then((response) => {
      if (response = true) {
        toast.success("Sprint updated successfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate("/user/admin/sprint/all");
        }, 1000);
      } else {
        toast.error("Error updating sprint", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    }).catch(error => {
      console.error("Error:", error);
      toast.error("Failed to update sprint. Please try again.", {
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
                        <h1>Edit Sprint</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Edit Sprint
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={updateSprint}>
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
                        onChange={handleUserInput}
                        value={editSprintRequest.name}
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
                        onChange={handleUserInput}
                        value={editSprintRequest.startDate}
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
                        onChange={handleUserInput}
                        value={editSprintRequest.endDate}
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
                        onChange={handleUserInput}
                        value={editSprintRequest.projectId}
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
                    <input
                      type="submit"
                      className="btn float-right"
                      value="Update Sprint"
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

export default EditSprint;
