import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewDetailProject = () => {
  const { id } = useParams();

  const [projectDetails, setProjectDetails] = useState({
    name: "",
    description: "",
    manager: "",
    startDate: "",
    deadlineDate: "",
    teamMembers: [],
    projectStatus: "",
  });

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const fetchProjectDetails = () => {
    request({
      url: `${API_BASE_URL}/api/project/${id}`,
      method: "GET",
    })
      .then((response) => {
        console.log(response);
        if (response && response.success) {
          const project = response;
          setProjectDetails({
            name: project.name || "",
            description: project.description || "",
            manager: project.managerName || "",
            startDate: project.startDate || "",
            deadlineDate: project.deadlineDate || "",
            teamMembers: project.teamMembers || [],
            projectStatus: project.projectStatus || "",
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
        // Handle redirect or additional error handling
      });
  };

  const memberOptions = projectDetails.teamMembers.map((member) => ({
    value: member.id,
    label: member.name,
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
                        <h1>View Project Details</h1>
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
                            View Project
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
                        Project Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter project name"
                        name="name"
                        value={projectDetails.name}
                        disabled
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
                        value={projectDetails.description}
                        disabled
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="manager" className="form-label">
                        Project Manager
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="manager"
                        name="manager"
                        value={projectDetails.manager}
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
                        value={projectDetails.startDate}
                        disabled
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
                        value={projectDetails.deadlineDate}
                        disabled
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="teamMembers" className="form-label">
                        Team Members
                      </label>
                      <Select
                        options={memberOptions}
                        isDisabled
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={memberOptions.filter((option) =>
                          projectDetails.teamMembers.some(
                            (member) => member.id === option.value
                          )
                        )}
                        isMulti
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="projectStatus" className="form-label">
                        Project Status
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="projectStatus"
                        name="projectStatus"
                        value={projectDetails.projectStatus}
                        disabled
                      />
                    </div>
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

export default ViewDetailProject;
