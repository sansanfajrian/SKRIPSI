import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewAllEmployeeSprints = () => {
  const [allSprints, setAllSprints] = useState([]);
  const [sprintName, setSprintName] = useState("");
  const [sprintId, setSprintId] = useState("");
  const [deleteSprintId, setDeleteSprintId] = useState("");
  const navigate = useNavigate();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = allSprints.slice(firstIndex, lastIndex);
  const npage = Math.ceil(allSprints.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  useEffect(() => {
    const getAllSprints = async () => {
      const allSprints = await retrieveAllSprints();
      if (allSprints) {
        setAllSprints(allSprints);
      }
    };
    getAllSprints();
  }, []);

  const retrieveAllSprints = () => {
    request({
      url: API_BASE_URL + "/api/sprint/fetch/employee",
      method: "GET",
    })
      .then((response) => {
        console.log(response);
        setAllSprints(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSprintsByName = async () => {
    const allSprints = await retrieveSprintsByName();
    if (allSprints) {
      setAllSprints(allSprints);
    }
  };

  const retrieveSprintsByName = async () => {
    const Sprints = await request({
      url: API_BASE_URL + "/api/sprint/search?sprintName=" + sprintName,
      method: "GET",
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });

    return Sprints;
  };

  const searchSprintByName = (e) => {
    getSprintsByName();
    setSprintName("");
    e.preventDefault();
  };

  const getSprintsById = async () => {
    const allSprints = await retrieveSprintsById();
    if (allSprints) {
      setAllSprints(allSprints);
    }
  };

  const retrieveSprintsById = async () => {
    const Sprints = await request({
      url: API_BASE_URL + "/api/sprint/search/id?sprintId=" + (sprintId === "" ? 0 : sprintId),
      method: "GET",
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });

    return Sprints;
  };

  const searchSprintById = (e) => {
    getSprintsById();
    setSprintId("");
    e.preventDefault();
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
                style={{ height: "45rem" }}
              >
                <div className="card-header">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-6">
                        <h1>All Employee Sprints</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">All Employee Sprints</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body" style={{ overflowY: "auto" }}>
                  <div className="row g-3">
                    <div className="col-auto">
                      <form className="row g-3">
                        <div className="col-auto">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Sprint Name..."
                            onChange={(e) => setSprintName(e.target.value)}
                            value={sprintName}
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn mb-3"
                            onClick={searchSprintByName}
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
                            placeholder="Enter Sprint Id..."
                            onChange={(e) => setSprintId(e.target.value)}
                            value={sprintId}
                            required
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn bg-color mb-3"
                            onClick={searchSprintById}
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
                          <th scope="col">Project</th>
                          <th scope="col">Sprint Name</th>
                          <th scope="col">Start Date</th>
                          <th scope="col">End Date</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((sprint, i) => (
                          <tr key={i}>
                            <td className="text-center">
                              <b>{sprint.projectName}</b>
                            </td>
                            <td className="text-center">
                              <b>{sprint.name}</b>
                            </td>
                            <td className="text-center">
                              <b>{sprint.startDate}</b>
                            </td>
                            <td className="text-center">
                              <b>{sprint.endDate}</b>
                            </td>
                            <td className="text-center">
                              <div>
                                <button
                                  onClick={() => navigate(`/user/employee/sprint/${sprint.sprintId}`)}
                                  className="btn btn-sm bg-color custom-bg-text mx-1"
                                  style={{
                                    backgroundColor: "#2a67f4",
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                  title="View Sprint"
                                >
                                  <i className="nav-icon fas fa-info" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <nav className="float-right">
                        <ul className="pagination">
                        <li className="page-item">
                            <a href="#" className="page-link" onClick={prePage}>
                            Prev
                            </a>
                        </li>
                        {numbers.map((n, i) => (
                            <li className={`page-item ${currentPage === n ? "active" : ""}`} key={i}>
                            <a href="#" className="page-link" onClick={() => changeCPage(n)}>
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  function prePage() {
    if (currentPage !== firstIndex) {
      setCurrentPage(currentPage - 1);
    }
  }

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

  function changeCPage(id) {
    setCurrentPage(id);
  }
};

export default ViewAllEmployeeSprints;
