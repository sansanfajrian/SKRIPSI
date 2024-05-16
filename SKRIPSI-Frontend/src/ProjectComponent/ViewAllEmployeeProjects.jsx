import { useState, useRef, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import $ from 'jquery';
import 'datatables.net-bs4';

const ViewAllEmployeeProjects = () => {
  const employee = JSON.parse(sessionStorage.getItem("active-employee"));

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

    setTimeout(() => {
      $(tableRef.current).DataTable(
        {
            paging: true,
            lengthChange: false,
            searching: false,
            ordering: false,
            autoWidth: true,
            responsive: true,
        }
      )
    },200);

  }, []);

  const retrieveAllProject = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/project/fetch/employee?employeeId=" +
        employee.id
    );
    console.log(response.data);
    return response.data;
  };

  const getProjectsByName = async () => {
    const allProject = await retrieveProjectByName();
    if (allProject) {
      setAllProjects(allProject.projects);
    }
  };

  const retrieveProjectByName = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/project/employee/search?projectName=" +
        projectName +
        "&employeeId=" +
        employee.id
    );
    console.log(response.data);
    return response.data;
  };

  const searchProjectbyName = (e) => {
    getProjectsByName();
    setProjectName("");
    e.preventDefault();
  };

  const updateProjectStatus = (project) => {
    navigate("/employee/project/status/update", { state: project });
  };

  return (
    <div className="content-wrapper">

      <section className="content-header">
      </section>

      <section class="content">
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
                      <h1>My Projects</h1>
                    </div>
                    <div className="col-sm-6">
                      <ol className="breadcrumb float-sm-right" style={{backgroundColor: 'transparent'}}>
                        <li className="breadcrumb-item" ><a href="#">Home</a></li>
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
                <div class="col-auto">
                  <form class="row g-3">
                    <div class="col-auto">
                      <input
                        type="text"
                        class="form-control"
                        id="inputPassword2"
                        placeholder="Enter Project Name..."
                        onChange={(e) => setProjectName(e.target.value)}
                        value={projectName}
                      />
                    </div>
                    <div class="col-auto">
                      <button
                        type="submit"
                        class="btn bg-color custom-bg-text mb-3"
                        onClick={searchProjectbyName}
                        style={{backgroundColor: "#3393df", color: "white", fontWeight: "bold"}}
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="table-responsive">
                <table ref={tableRef} className="table table-bordered table-hover">
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
                              if (project.projectStatus !== "Completed") {
                                return (
                                  <button
                                    onClick={() => updateProjectStatus(project)}
                                    className="btn btn-sm"
                                    style={{backgroundColor: "#3393df", color: "white", fontWeight: "bold"}}
                                  >
                                    <b>Update Project Status</b>
                                  </button>
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewAllEmployeeProjects;
