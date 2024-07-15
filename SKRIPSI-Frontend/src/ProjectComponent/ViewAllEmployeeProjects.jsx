import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../ConfirmDialog";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewAllEmployeeProject = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
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
    const getAllEmployeeProjects = async () => {
      const allProjects = await retrieveAllEmployeeProjects();
      if (allProjects) {
        setAllProjects(allProjects.projects);
      }
    };
    getAllEmployeeProjects();
  }, []);

  const retrieveAllEmployeeProjects = () => {
    return request({
      url: API_BASE_URL + "/api/project/fetch/employee",
      method: "GET",
    })
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchEmployeeProjectsByName = async () => {
    const allProjects = await retrieveEmployeeProjectsByName();
    if (allProjects) {
      setAllProjects(allProjects);
    }
  };

  const retrieveEmployeeProjectsByName = async () => {
    const projects = await request({
      url: API_BASE_URL + "/api/employee/projects?employeeName=" + employeeName,
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

  const searchProjectsByEmployeeName = (e) => {
    searchEmployeeProjectsByName();
    setEmployeeName("");
    e.preventDefault();
  };

  const handleDelete = (projectId) => {
    setDialogOpen(true);
    setDeleteProjectId(projectId);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    deleteProject(deleteProjectId);
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
                        <h1>All Employee Projects</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol
                          className="breadcrumb float-sm-right"
                          style={{ backgroundColor: "transparent" }}
                        >
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">All Employee Projects</li>
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
                            placeholder="Enter Employee Name..."
                            onChange={(e) => setEmployeeName(e.target.value)}
                            value={employeeName}
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn mb-3"
                            onClick={searchProjectsByEmployeeName}
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
                            <td className="text-center">
                              <div>
                                <button
                                  onClick={() => navigate(`/user/employee/project/${project.id}`)}
                                  className="btn btn-sm bg-color custom-bg-text mx-1"
                                  style={{
                                    backgroundColor: "#2a67f4",
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                  title="View Project"
                                >
                                  <i className="nav-icon fas fa-info" />
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
        title="Confirmation"
        message="Are you sure you want to delete this project?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
  function changePage(id) {
    setCurrentPage(id);
  }
};

export default ViewAllEmployeeProject;

