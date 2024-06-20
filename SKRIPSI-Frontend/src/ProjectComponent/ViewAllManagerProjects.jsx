import { useState, useRef, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import "datatables.net-bs4";
import { request } from "../util/APIUtils";
import { API_BASE_URL } from "../constants";

const ViewAllManagerProjects = () => {
  const manager = JSON.parse(sessionStorage.getItem("active-manager"));

  const [allProjects, setAllProjects] = useState([]);

  const [projectName, setProjectName] = useState("");

  const navigate = useNavigate();

  const tableRef = useRef(null);

  useEffect(() => {
    const getAllProject = async () => {
      const allProject = await retrieveAllProject();
      if (allProject) {
        setAllProjects(allProject.projects);
      }
    };

    getAllProject();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = allProjects.slice(firstIndex, lastIndex);
  const npage = Math.ceil(allProjects.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const retrieveAllProject = async () => {
    request({
      url: API_BASE_URL + "/api/project/fetch/manager?managerId=" + manager.id,
      method: "GET",
    })
      .then((response) => {
        setAllProjects(response.projects);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProjectsByName = async () => {
    const allProject = await retrieveProjectByName();
    if (allProject) {
      setAllProjects(allProject);
    }
  };

  const retrieveProjectByName = async () => {
    const projects = await request({
      url: API_BASE_URL + "/api/project/manager/search?projectName=" + projectName + "&managerId=" + manager.id,
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

  const searchProjectbyName = (e) => {
    getProjectsByName();
    setProjectName("");
    e.preventDefault();
  };

  const assignToEmployee = (project) => {
    navigate("/project/assign/employee", { state: project });
  };

  return (
    <div className="content-wrapper">
      <section className="content-header"></section>

      <section className="content">
        <div className="container-fluid">
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
                        className="btn bg-color custom-bg-text mb-3"
                        onClick={searchProjectbyName}
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
                <table
                  ref={tableRef}
                  className="table table-bordered table-hover"
                >
                  <thead className="table-bordered bg-color custom-bg-text border-color">
                    <tr className="text-center">
                      <th scope="col">Project Name</th>
                      <th scope="col">Project Description</th>
                      <th scope="col">Project Requirement</th>
                      <th scope="col">Manager Assign Status</th>
                      <th scope="col">Manager Name</th>
                      <th scope="col">Employee Assign Status</th>
                      <th scope="col">Employee Name</th>
                      <th scope="col">Project Created Date</th>
                      <th scope="col">Project Assign Date</th>
                      <th scope="col">Project Deadline</th>
                      <th scope="col">Project Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProjects.map((project) => {
                      return (
                        <tr>
                          <td>
                            <b>{project.name}</b>
                          </td>

                          <td>
                            <b>{project.description}</b>
                          </td>
                          <td>
                            <b>{project.requirement}</b>
                          </td>
                          <td className="text-center">
                            <b>{project.assignedToManager}</b>
                          </td>
                          <td>
                            <b>{project.managerName}</b>
                          </td>
                          <td className="text-center">
                            <b>{project.assignedToEmployee}</b>
                          </td>
                          <td>
                            <b>{project.employeeName}</b>
                          </td>
                          <td className="text-center">
                            <b>{project.createdDate}</b>
                          </td>
                          <td className="text-center">
                            <b>{project.assignedDate}</b>
                          </td>
                          <td className="text-center">
                            <b>{project.deadlineDate}</b>
                          </td>
                          <td className="text-center">
                            <b>{project.projectStatus}</b>
                          </td>
                          <td className="text-center">
                            {(() => {
                              if (
                                project.assignedToEmployee === "Not Assigned"
                              ) {
                                return (
                                  <div>
                                    <button
                                      onClick={() => assignToEmployee(project)}
                                      className="btn btn-sm"
                                      style={{
                                        backgroundColor: "#3393df",
                                        color: "white",
                                        fontWeight: "bold",
                                      }}
                                      title="Assign to Employee"
                                    >
                                      <b>Assign to Employee</b>
                                    </button>
                                  </div>
                                );
                              }
                            })()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer">
              <nav className="float-right">
                <ul className="pagination">
                  <li className="page-item">
                    <a href="#" className="page-link" onClick={prePage}>
                      Prev
                    </a>
                  </li>
                  {numbers.map((n, i) => (
                    <li
                      className={`page-item ${
                        currentPage === n ? "active" : ""
                      }`}
                      key={i}
                    >
                      <a
                        href="#"
                        className="page-link"
                        onClick={() => changeCPage(n)}
                      >
                        {n}
                      </a>
                    </li>
                  ))}
                  <li className="page-item">
                    <a href="#" className="page-link" onClick={nextPage}>
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id) {
    setCurrentPage(id);
  }

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
};

export default ViewAllManagerProjects;
