import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../ConfirmDialog";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewAllProjects = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = allProjects.slice(firstIndex, lastIndex);
  const npage = Math.ceil(allProjects.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  useEffect(() => {
    const getAllProjects = async () => {
      const allProjects = await retrieveAllProjects();
      if (allProjects) {
        setAllProjects(allProjects.projects);
      }
    };
    getAllProjects();
  }, []);

  const retrieveAllProjects = () => {
    return request({
      url: API_BASE_URL + "/api/project/fetch",
      method: "GET",
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProjectsByName = async () => {
    const allProjects = await retrieveProjectsByName();
    if (allProjects) {
      setAllProjects(allProjects);
    }
  };

  const retrieveProjectsByName = async () => {
    const projects = await request({
      url: API_BASE_URL + "/api/project/search?projectName=" + projectName,
      method: "GET",
    })
      .then((response) => {
        return response.projects;
      })
      .catch((error) => {
        console.log(error);
      });

    return projects;
  };

  const searchProjectByName = (e) => {
    getProjectsByName();
    setProjectName("");
    e.preventDefault();
  };

  const getProjectsById = async () => {
    const allProjects = await retrieveProjectsById();
    if (allProjects) {
      setAllProjects(allProjects);
    }
  };

  const retrieveProjectsById = async () => {
    const projects = await request({
      url:
        API_BASE_URL +
        "/api/project/search/id?projectId=" +
        (projectId === "" ? 0 : projectId),
      method: "GET",
    })
      .then((response) => {
        return response.projects;
      })
      .catch((error) => {
        console.log(error);
      });

    return projects;
  };

  const searchProjectById = (e) => {
    getProjectsById();
    setProjectId("");
    e.preventDefault();
  };

  const assignToManager = (project) => {
    navigate("/project/assign/manager", { state: project });
  };

  const editProject = (projectId) => {
    navigate(`/user/admin/project/edit/${projectId}`);
  };

  const handleDelete = (projectId) => {
    setDialogOpen(true);
    setDeleteProjectId(projectId);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    deleteProject(deleteProjectId)
  };

  const handleCancel = () => {
    setDialogOpen(false);
    console.log("Delete action canceled");
  };

  const deleteProject = (projectId) => {
    return request({
      url: API_BASE_URL + "/api/project/delete/" + projectId,
      method: "DELETE",
    })
      .then((result) => {
        console.log(result);
        if (result.success) {
          setAllProjects(allProjects.filter((project) => project.id !== projectId));
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
            window.location.reload();
          }, 1000);
        } else {
          toast.error("Failed to delete project. Please try again.", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
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
              <div
                className="card form-card ms-2 me-2 mb-5 custom-bg border-color "
                style={{
                  height: "45rem",
                }}
              >
                <div className="card-header">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-6">
                        <h1>All Projects</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol
                          className="breadcrumb float-sm-right"
                          style={{ backgroundColor: "transparent" }}
                        >
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">All Project</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="card-body"
                  style={{
                    overflowY: "auto",
                  }}
                >
                  <div className="row g-3">
                    <div className="col-auto">
                      <form className="row g-3">
                        <div className="col-auto">
                          <input
                            type="text"
                            className="form-control"
                            id="inputPassword2"
                            placeholder="Enter Project Name..."
                            onChange={(e) => setProjectName(e.target.value)}
                            value={projectName}
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn mb-3"
                            onClick={searchProjectByName}
                            style={{
                              backgroundColor: "#3393df",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Search
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="col-auto">
                      <form className="row g-3">
                        <div className="col-auto">
                          <input
                            type="number"
                            className="form-control"
                            id="inputPassword2"
                            placeholder="Enter Project Id..."
                            onChange={(e) => setProjectId(e.target.value)}
                            value={projectId}
                            required
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn bg-color mb-3"
                            onClick={searchProjectById}
                            style={{
                              backgroundColor: "#3393df",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Search
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-bordered bg-color custom-bg-text border-color">
                        <tr className="text-center">
                          <th scope="col">Project Name</th>
                          <th scope="col">Manager Name</th>
                          <th scope="col">Members</th>
                          <th scope="col">Project Start</th>
                          <th scope="col">Project Deadline</th>
                          <th scope="col">Project Status</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((project, i) => (
                          <tr key={i}>
                            <td className="text-center">
                              <b>{project.name}</b>
                            </td>
                            <td className="text-center">
                              <b>{project.managerName}</b>
                            </td>
                            <td className="text-center">
                              {project.teamMembers.map((member, index) => (
                                <div key={index} className="d-flex align-items-center mb-1">
                                  <b><b>-</b> {member.name}</b>
                                </div>
                              ))}
                            </td>
                            <td className="text-center">
                              <b>{project.startDate}</b>
                            </td>
                            <td className="text-center">
                              <b>{project.deadlineDate}</b>
                            </td>
                            <td className="text-center">
                              <b>
                                <span className={`badge ${project.projectStatus === 'Started' ? 'badge-primary' : project.projectStatus === 'In Progress' ? 'badge-warning' : 'badge-success'}`}>
                                  {project.projectStatus}
                                </span>
                              </b>
                            </td>
                            <td className="text-center" width="20%">
                              <div>
                                <button
                                  onClick={() => editProject(project.id)}
                                  className="btn btn-sm bg-color custom-bg-text mx-1"
                                  style={{
                                    backgroundColor: "#f4a62a",
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                  title="Edit Project"
                                >
                                  <i className="nav-icon fas fa-edit" />
                                </button>
                                <button
                                  onClick={() => handleDelete(project.id)}
                                  className="btn btn-sm bg-color custom-bg-text"
                                  style={{
                                    backgroundColor: "#df3333",
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                  title="Remove Project"
                                >
                                  <i className="nav-icon fas fa-trash" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer">
                  <nav className="float-right">
                    <ul className="pagination">
                      <li className="page-item">
                        <a
                          href="#"
                          className="page-link"
                          onClick={() => changePage(currentPage - 1)}
                        >
                          Prev
                        </a>
                      </li>
                      {numbers.map((n, i) => (
                        <li
                          className={`page-item ${currentPage === n ? "active" : ""}`}
                          key={i}
                        >
                          <a
                            href="#"
                            className="page-link"
                            onClick={() => changePage(n)}
                          >
                            {n}
                          </a>
                        </li>
                      ))}
                      <li className="page-item">
                        <a
                          href="#"
                          className="page-link"
                          onClick={() => changePage(currentPage + 1)}
                        >
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );

  function changePage(id) {
    setCurrentPage(id);
  }
};

export default ViewAllProjects;
