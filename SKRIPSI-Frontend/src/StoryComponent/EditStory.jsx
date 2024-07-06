import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const EditStory = () => {
  const { id } = useParams(); // Ambil ID story dari URL
  const [editStoryRequest, setEditStoryRequest] = useState({
    code: "",
    name: "",
    status: "started", // Default value for the status
    projectId: ""
  });
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil data story yang akan diedit dari backend
    request({
      url: API_BASE_URL + `/api/story/get/${id}`,
      method: "GET",
    }).then((response) => {
      console.log("Story API response:", response); // Log response
      // Set nilai form dengan data story yang diterima
      setEditStoryRequest({
        code: response.code,
        name: response.name,
        status: response.status,
        projectId: response.projectId
      });
    }).catch((error) => {
      console.error("Error fetching story:", error);
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
    setEditStoryRequest({
      ...editStoryRequest,
      [e.target.name]: e.target.value,
    });
  };

  const updateStory = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('accessToken');

    // Kirim perubahan story ke backend
    request({
      url: API_BASE_URL + `/api/story/edit/${id}`,
      method: "PUT",
      body: JSON.stringify(editStoryRequest),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
      },
    }).then((response) => {
      if (response = true) {
        toast.success("Story updated successfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate("/user/admin/story/all");
        }, 1000);
      } else {
        toast.error("Error updating story", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    }).catch(error => {
      console.error("Error:", error);
      toast.error("Failed to update story. Please try again.", {
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
                        <h1>Edit Story</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Edit Story
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={updateStory}>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="code" className="form-label">
                        Story Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="code"
                        placeholder="Enter story code"
                        name="code"
                        onChange={handleUserInput}
                        value={editStoryRequest.code}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Story Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter story name"
                        name="name"
                        onChange={handleUserInput}
                        value={editStoryRequest.name}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        className="form-control"
                        id="status"
                        name="status"
                        onChange={handleUserInput}
                        value={editStoryRequest.status}
                      >
                        <option value="started">Started</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
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
                        onChange={handleUserInput}
                        value={editStoryRequest.projectId}
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
                      value="Update Story"
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

export default EditStory;
