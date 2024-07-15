import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewAllEmployeeBacklogs = () => {
  const [allBacklogs, setAllBacklogs] = useState([]);
  const [backlogName, setBacklogName] = useState("");
  const [backlogId, setBacklogId] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = allBacklogs.slice(firstIndex, lastIndex);
  const npage = Math.ceil(allBacklogs.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  useEffect(() => {
    const getAllBacklogs = async () => {
      const allBacklogs = await retrieveAllBacklogs();
      if (allBacklogs) {
        setAllBacklogs(allBacklogs);
      }
    };
    getAllBacklogs();
  }, []);

  const retrieveAllBacklogs = () => {
    request({
      url: API_BASE_URL + "/api/backlog/fetch/employee",
      method: "GET",
    })
      .then((response) => {
        console.log(response);
        setAllBacklogs(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getBacklogsByName = async () => {
    const allBacklogs = await retrieveBacklogsByName();
    if (allBacklogs) {
      setAllBacklogs(allBacklogs);
    }
  };

  const retrieveBacklogsByName = async () => {
    const Backlogs = await request({
      url: API_BASE_URL + "/api/backlog/search?backlogName=" + backlogName,
      method: "GET",
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });

    return Backlogs;
  };

  const searchBacklogByName = (e) => {
    getBacklogsByName();
    setBacklogName("");
    e.preventDefault();
  };

  const getBacklogsById = async () => {
    const allBacklogs = await retrieveBacklogsById();
    if (allBacklogs) {
      setAllBacklogs(allBacklogs);
    }
  };

  const retrieveBacklogsById = async () => {
    const Backlogs = await request({
      url: API_BASE_URL + "/api/backlog/search/id?backlogId=" + (backlogId === "" ? 0 : backlogId),
      method: "GET",
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });

    return Backlogs;
  };

  const searchBacklogById = (e) => {
    getBacklogsById();
    setBacklogId("");
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
                        <h1>All Backlogs</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">All Backlogs</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body" style={{ overflowX: "auto", overflowY: "auto" }}>
                  <div className="row g-3">
                    <div className="col-auto">
                      <form className="row g-3">
                        <div className="col-auto">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Backlog Name..."
                            onChange={(e) => setBacklogName(e.target.value)}
                            value={backlogName}
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn mb-3"
                            onClick={searchBacklogByName}
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
                            placeholder="Enter Backlog Id..."
                            onChange={(e) => setBacklogId(e.target.value)}
                            value={backlogId}
                            required
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn bg-color mb-3"
                            onClick={searchBacklogById}
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
                          <th scope="col">Code</th>
                          <th scope="col">Name</th>
                          <th scope="col">Notes</th>
                          <th scope="col">Est. Effort</th>
                          <th scope="col">Add. Effort</th>
                          <th scope="col">Act. Effort</th>
                          <th scope="col">Prog.</th>
                          <th scope="col">Status</th>
                          <th scope="col">Start Date</th>
                          <th scope="col">Plan End Date</th>
                          <th scope="col">Done Date</th>
                          <th scope="col">Planned PIC Name</th>
                          <th scope="col">Rlz PIC Name</th>
                          <th scope="col">Story Name</th>
                          <th scope="col">Backlog Name</th>
                          <th scope="col">Project Name</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((backlog, i) => (
                          <tr key={i}>
                            <td>{backlog.code}</td>
                            <td>{backlog.name}</td>
                            <td>{backlog.notes}</td>
                            <td>{backlog.estEffort || "-"}</td>
                            <td>{backlog.addEffort || "-"}</td>
                            <td>{backlog.actEffort || "-"}</td>
                            <td>{backlog.prog || "-"}</td>
                            <td>{backlog.status || "-"}</td>
                            <td>{backlog.startDate || "-"}</td>
                            <td>{backlog.planEndDate || "-"}</td>
                            <td>{backlog.doneDate || "-"}</td>
                            <td>{backlog.plannedPicName || "-"}</td>
                            <td>{backlog.rlzPicName || "-"}</td>
                            <td>{backlog.storyName || "-"}</td>
                            <td>{backlog.sprintName || "-"}</td>
                            <td>{backlog.projectName || "-"}</td>
                            <td className="text-center">
                              <button
                                onClick={() => navigate(`/user/employee/backlog/${backlog.backlogId}`)}
                                className="btn btn-sm bg-color custom-bg-text mx-1"
                                style={{
                                  backgroundColor: "#2a67f4",
                                  color: "white",
                                  fontWeight: "bold",
                                }}
                                title="View Backlog"
                              >
                                <i className="nav-icon fas fa-info" />
                              </button>
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

export default ViewAllEmployeeBacklogs;