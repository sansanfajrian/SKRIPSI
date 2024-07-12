import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editProjectRequest, setEditProjectRequest] = useState({
    name: "",
    description: "",
    managerId: "",
    startDate: "",
    startTime: "08:00", // Default start time set to 08:00
    deadlineDate: "",
    deadlineTime: "08:00", // Default deadline time set to 08:00
    reminderEmail: 10, // Default reminder email set to 10
    reminderPopup: 10, // Default reminder popup set to 10
    memberIds: [],
    projectStatus: "",
  });

  const [users, setUsers] = useState({
    managers: [],
    employees: [],
  });

  useEffect(() => {
    fetchProjectDetails();
    fetchUsers();
  }, []);

  const fetchProjectDetails = () => {
    request({
      url: `${API_BASE_URL}/api/project/${id}`,
      method: "GET",
    })
      .then((response) => {
        if (response && response.success) {
          const projectDetails = response;
          setEditProjectRequest({
            name: projectDetails.name || "",
            description: projectDetails.description || "",
            managerId: projectDetails.managerId || "",
            startDate: projectDetails.startDate || "",
            deadlineDate: projectDetails.deadlineDate || "",
            memberIds: projectDetails.teamMembers.map((member) => member.id) || [],
            projectStatus: projectDetails.projectStatus || "",
          });
        } else {
          console.error("Empty response or missing data in response:", response);
          toast.error("Failed to fetch project details. Please try again.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching project details:", error);
        toast.error("Failed to fetch project details. Please try again.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          window.location.href = "/user/admin/project/all";
        }, 1000);
      });
  };

  const retrieveAllManagers = async () => {
    try {
      const response = await request({
        url: `${API_BASE_URL}/api/user/manager/all`,
        method: "GET",
      });
      return response.users;
    } catch (error) {
      console.error("Error fetching managers:", error);
      throw error;
    }
  };

  const retrieveAllEmployees = async () => {
    try {
      const response = await request({
        url: `${API_BASE_URL}/api/user/employee/all`,
        method: "GET",
      });
      return response.users;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  };

  const fetchUsers = () => {
    Promise.all([retrieveAllManagers(), retrieveAllEmployees()])
      .then(([managers, employees]) => {
        setUsers({
          managers: managers,
          employees: employees,
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const handleProjectInput = (e) => {
    setEditProjectRequest({
      ...editProjectRequest,
      [e.target.name]: e.target.value,
    });
  };

  const handleMemberSelectChange = (selectedOptions) => {
    const selectedMemberIds = selectedOptions.map((option) => option.value);
    setEditProjectRequest({
      ...editProjectRequest,
      memberIds: selectedMemberIds,
    });
  };

  const validateForm = () => {
    const {
      name,
      description,
      managerId,
      startDate,
      deadlineDate,
      projectStatus,
    } = editProjectRequest;
    return (
      name &&
      description &&
      managerId &&
      startDate &&
      deadlineDate &&
      projectStatus &&
      editProjectRequest.memberIds.length > 0
    );
  };

  const updateProject = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    console.log(JSON.stringify(editProjectRequest));
    request({
      url: `${API_BASE_URL}/api/project/edit/${id}`,
      method: "PUT",
      body: JSON.stringify(editProjectRequest),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((result) => {
        if (result.success) {
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
          }, 1000);
        } else {
          toast.error("Failed to update project. Please try again.", {
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
        console.error("Error updating project:", error);
        toast.error("Failed to update project. Please try again.", {
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

  const statusOptions = [
    { value: "Started", label: "Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  const memberOptions = users.employees.map((employee) => ({
    value: employee.id,
    label: employee.name,
  }));

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
                <form onSubmit={updateProject}>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Project Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter project name"
                        name="name"
                        onChange={handleProjectInput}
                        value={editProjectRequest.name}
                        required
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
                        placeholder="Enter project description"
                        onChange={handleProjectInput}
                        value={editProjectRequest.description}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="managerId" className="form-label">
                        Project Manager
                      </label>
                      <Select
                        options={users.managers.map((manager) => ({
                          value: manager.id,
                          label: manager.name,
                        }))}
                        required
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={{
                          value: editProjectRequest.managerId,
                          label: users.managers.find(
                            (manager) => manager.id === editProjectRequest.managerId
                          )?.name,
                        }}
                        onChange={(selectedOption) =>
                          setEditProjectRequest({
                            ...editProjectRequest,
                            managerId: selectedOption.value,
                          })
                        }
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
                        onChange={handleProjectInput}
                        value={editProjectRequest.startDate}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="deadlineDate" className="form-label">
                        Deadline Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="deadlineDate"
                        name="deadlineDate"
                        onChange={handleProjectInput}
                        value={editProjectRequest.deadlineDate}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="memberIds" className="form-label">
                        Team Members
                      </label>
                      <Select
                        options={memberOptions}
                        isMulti
                        required
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={memberOptions.filter((option) =>
                          editProjectRequest.memberIds.includes(option.value)
                        )}
                        onChange={handleMemberSelectChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="projectStatus" className="form-label">
                        Project Status
                      </label>
                      <Select
                        options={statusOptions}
                        required
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={{
                          value: editProjectRequest.projectStatus,
                          label: editProjectRequest.projectStatus,
                        }}
                        onChange={(selectedOption) =>
                          setEditProjectRequest({
                            ...editProjectRequest,
                            projectStatus: selectedOption.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <button
                      type="submit"
                      className="btn btn-primary float-right"
                      disabled={!validateForm()}
                      style={{
                        backgroundColor: "#3393df",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Update Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer />
    </div>
  );
};

export default EditProject;
