import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const AddProject = () => {
  const [addProjectRequest, setAddProjectRequest] = useState({
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
  });

  const [users, setUsers] = useState({
    managers: [],
    employees: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const retrieveAllManagers = async () => {
    try {
      const response = await request({
        url: API_BASE_URL + "/api/user/manager/all",
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
        url: API_BASE_URL + "/api/user/employee/all",
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

  const handleUserInput = (e) => {
    setAddProjectRequest({
      ...addProjectRequest,
      [e.target.name]: e.target.value,
    });
  };

  const handleMemberSelectChange = (selectedOptions) => {
    const selectedMemberIds = selectedOptions.map((option) => option.value);
    setAddProjectRequest({
      ...addProjectRequest,
      memberIds: selectedMemberIds,
    });
  };

  const saveProject = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken);

    const formData = new FormData();
    formData.append("name", addProjectRequest.name);
    formData.append("description", addProjectRequest.description);
    formData.append("managerId", addProjectRequest.managerId);
    formData.append("startDate", addProjectRequest.startDate);
    formData.append("startTime", addProjectRequest.startTime);
    formData.append("deadlineDate", addProjectRequest.deadlineDate);
    formData.append("deadlineTime", addProjectRequest.deadlineTime);
    formData.append("reminderEmail", addProjectRequest.reminderEmail);
    formData.append("reminderPopup", addProjectRequest.reminderPopup);
    addProjectRequest.memberIds.forEach((memberId) => {
      formData.append("memberIds", memberId);
    });

    console.log(JSON.stringify(addProjectRequest));

    request({
      url: API_BASE_URL + "/api/project/add",
      method: "POST",
      body: JSON.stringify(addProjectRequest),
      headers: {
        "Content-Type": "application/json", // Ensure this line is sending the correct header
        Authorization: `Bearer ${accessToken}`, // Assuming you need Authorization header
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
          }, 1000); // Redirect after success
        } else {
          toast.error("Failed to add project. Please try again.", {
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
        console.error("Error adding project:", error);
        toast.error("Failed to add project. Please try again.", {
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
                        <h1>Add Project</h1>
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
                            Add Project
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={saveProject}>
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
                        onChange={handleUserInput}
                        value={addProjectRequest.name}
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
                        onChange={handleUserInput}
                        value={addProjectRequest.description}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="managerId" className="form-label">
                        Project Manager
                      </label>
                      <select
                        className="form-control"
                        id="managerId"
                        name="managerId"
                        onChange={handleUserInput}
                        required
                      >
                        <option value="">-- Select Manager --</option>
                        {users.managers &&
                          users.managers.map((manager) => (
                            <option key={manager.id} value={manager.id}>
                              {manager.name}
                            </option>
                          ))}
                      </select>
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
                        value={addProjectRequest.startDate}
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
                        onChange={handleUserInput}
                        value={addProjectRequest.deadlineDate}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="memberIds" className="form-label">
                        Project Members
                      </label>
                      <Select
                        id="memberIds"
                        name="memberIds"
                        options={memberOptions}
                        isMulti
                        onChange={handleMemberSelectChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <input
                      type="submit"
                      className="btn float-right"
                      value="Add Project"
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

export default AddProject;
