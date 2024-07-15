import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewDetailRetrospective = () => {
  const { id } = useParams();

  const [retrospective, setRetrospective] = useState({
    status: "",
    projectName: "",
    from: "",
    to: "",
    sprintName: "",
    description: "",
  });

  useEffect(() => {
    fetchRetrospectiveDetails(id);
  }, [id]);

  const fetchRetrospectiveDetails = (id) => {
    request({
      url: `${API_BASE_URL}/api/retrospective/get/${id}`,
      method: "GET",
    })
      .then((response) => {
        console.log("Retrospective details:", response);
        const {
          status,
          projectName,
          from,
          to,
          sprintName,
          description,
          // Remove unused fields if not needed
        } = response;
        setRetrospective({
          status,
          projectName,
          from,
          to,
          sprintName,
          description,
        });
      })
      .catch((error) => {
        console.error("Error fetching retrospective details:", error);
        // Handle error
      });
  };

  return (
    <div className="content-wrapper">
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card form-card ms-2 me-2 mb-5 custom-bg border-color">
                <div className="card-header">
                <section className="content-header">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                        <h1>View Retrospective Details</h1>
                        </div>
                        <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item">
                            <Link to="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item active">View Retrospective</li>
                        </ol>
                        </div>
                    </div>
                </section>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="status"
                      value={retrospective.status}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="project" className="form-label">
                      Project
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="projectId"
                      value={retrospective.projectName}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="from" className="form-label">
                      From
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fromId"
                      value={retrospective.from}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="to" className="form-label">
                      To
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="toId"
                      value={retrospective.to}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="sprint" className="form-label">
                      Sprint
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="sprintId"
                      value={retrospective.sprintName}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows="3"
                      value={retrospective.description}
                      readOnly
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewDetailRetrospective;
