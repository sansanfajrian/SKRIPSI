import { useState, useRef, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import $ from 'jquery';
import 'datatables.net-bs4';
import ConfirmDialog from '../ConfirmDialog';

const ViewAllProjects = () => {

  const [allProjects, setAllProjects] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");

  const tableRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    
    const getAllProject = async () => {
      const allProject = await retrieveAllProject();
      if (allProject) {
        setAllProjects(allProject.projects);
      }
      
    };
    
    getAllProject();

    // setTimeout(() => {
    //   $(tableRef.current).DataTable(
    //     {
    //         paging: true,
    //         lengthChange: false,
    //         searching: false,
    //         ordering: false,
    //         autoWidth: true,
    //         responsive: true,
    //     }
    //   )
    // }, 500);

  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = allProjects.slice(firstIndex, lastIndex);
  const npage = Math.ceil(allProjects.length / recordsPerPage);
  const numbers = [...Array(npage +1).keys()].slice(1);

  const retrieveAllProject = async () => {
    const response = await axios.get("http://localhost:8080/api/project/fetch");
    console.log(response.data);
    setAllProjects(response.data);
    console.log("Apa Ini"+allProjects);
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
      "http://localhost:8080/api/project/search?projectName=" + projectName
    );
    console.log(response.data);
    return response.data;
  };

  const searchProjectbyName = (e) => {
    getProjectsByName();
    setProjectName("");
    e.preventDefault();
  };

  const getProjectsById = async () => {
    const allProject = await retrieveProjectById();
    if (allProject) {
      setAllProjects(allProject.projects);
    }
  };

  const retrieveProjectById = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/project/search/id?projectId=" + projectId
    );
    console.log(response.data);
    return response.data;
  };

  const searchProjectbyId = (e) => {
    getProjectsById();
    setProjectId("");
    e.preventDefault();
  };

  const assignToManager = (project) => {
    navigate("/project/assign/manager", { state: project });
  };

  const editProject = (project) => {
    navigate("/user/admin/project/edit", { state: project });
  };

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleDelete = (projekId) => {
    setDialogOpen(true);
    setProjectId(projekId);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    // Perform delete action
    console.log(projectId, 'was deleted');
  };

  const handleCancel = () => {
    setDialogOpen(false);
    console.log('Delete action canceled');
  };

  return (
    <div className="content-wrapper">

      <section className="content-header">
      </section>


    <section class="content">
      <div className="container-fluid">
        
        <div class="row">
          
          <div class="col-12">
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
                          class="btn mb-3"
                          onClick={searchProjectbyName}
                          style={{backgroundColor: "#3393df", color: "white", fontWeight: "bold"}}
                        >
                          Search
                        </button>
                      </div>
                    </form>
                  </div>
                  <div class="col-auto">
                    <form class="row g-3">
                      <div class="col-auto">
                        <input
                          type="number"
                          class="form-control"
                          id="inputPassword2"
                          placeholder="Enter Project Id..."
                          onChange={(e) => setProjectId(e.target.value)}
                          value={projectId}
                          required
                        />
                      </div>
                      <div class="col-auto">
                        <button
                          type="submit"
                          class="btn bg-color mb-3"
                          onClick={searchProjectbyId}
                          style={{backgroundColor: "#3393df", color: "white", fontWeight: "bold"}}
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
                      {records.map((project, i) => {
                        return (
                          <tr key={i}>
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
                            <td className="text-center" width="10%">
                              {(() => {
                                if (project.assignedToManager === "Not Assigned") {
                                
                                    return (
                                      <div>
                                        <button
                                          onClick={() => assignToManager(project)}
                                          className="btn btn-sm"
                                          style={{backgroundColor: "#3393df", color: "white", fontWeight: "bold"}}
                                          title="Assign to Manager"
                                          
                                        >
                                          <i className="flex nav-icon fas fa-people-arrows" />
                                        </button>
                                        <button
                                          onClick={() => editProject(project)}
                                          className="btn btn-sm bg-color custom-bg-text mx-1"
                                          style={{backgroundColor: "#f4a62a", color: "white", fontWeight: "bold"}}
                                          title="Edit Project"
                                        >
                                          <i className="nav-icon fas fa-edit" />
                                        </button>
                                        <button
                                          onClick={() => handleDelete(project.id)}
                                          className="btn btn-sm bg-color custom-bg-text"
                                          style={{backgroundColor: "#df3333", color: "white", fontWeight: "bold", width:30}}
                                          title="Remove Project"
                                        >
                                          <i className="nav-icon fas fa-trash" />
                                        </button>
                                      </div>
                                    );
                                  
                                } else {
                                  return (
                                    <div>
                                      <button
                                        onClick={""}
                                        className="btn btn-sm"
                                        style={{backgroundColor: "#3393df", color: "white", fontWeight: "bold"}}
                                        title="Assign to Manager"
                                        disabled
                                        
                                      >
                                        <i className="flex nav-icon fas fa-people-arrows" />
                                      </button>
                                      <button
                                        onClick={() => editProject(project)}
                                        className="btn btn-sm bg-color custom-bg-text mx-1"
                                        style={{backgroundColor: "#f4a62a", color: "white", fontWeight: "bold"}}
                                        title="Edit Project"
                                      >
                                        <i className="nav-icon fas fa-edit" />
                                      </button>
                                      <button
                                        onClick={() => handleDelete(project.id)}
                                        className="btn btn-sm bg-color custom-bg-text"
                                        style={{backgroundColor: "#df3333", color: "white", fontWeight: "bold", width:30}}
                                        title="Remove Project"
                                      >
                                        <i className="nav-icon fas fa-trash" />
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
              <div class="card-footer">
                <nav className="float-right">
                  <ul className='pagination'>
                    <li className='page-item'>
                      <a href='#' className='page-link' onClick={prePage}>Prev</a>
                    </li>
                    {numbers.map((n, i) => (
                      <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
                        <a href='#' className='page-link' onClick={() => changeCPage(n)}>{n}</a>
                      </li>
                    ))}
                    <li className='page-item'>
                      <a href='#' className='page-link' onClick={nextPage}>Next</a>
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
          message="Are you sure you want to delete this project ?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      
    </div>
  );
  
  function prePage(){
    if(currentPage !== 1){
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id){
    setCurrentPage(id);
  }

  function nextPage(){
    if(currentPage !== npage){
      setCurrentPage(currentPage + 1);
    }
  }

};

export default ViewAllProjects;
