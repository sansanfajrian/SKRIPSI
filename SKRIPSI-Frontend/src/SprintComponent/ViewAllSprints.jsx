import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../ConfirmDialog";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewAllSprints = () => {
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
      url: API_BASE_URL + "/api/sprint/fetch",
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

  const editSprint = (sprintId) => {
    navigate(`/user/admin/sprint/edit/${sprintId}`);
  };

  const handleDelete = (sprintId) => {
    setDialogOpen(true);
    setDeleteSprintId(sprintId);
  };
  
  const handleConfirm = () => {
    setDialogOpen(false);
    deleteSprint(deleteSprintId)
      .then(() => {
        toast.warning("Sprint deleted successfully", {
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
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const handleCancel = () => {
    setDialogOpen(false);
  };
  
  const deleteSprint = (sprintId) => {
    return request({
      url: API_BASE_URL + "/api/sprint/delete/" + sprintId,
      method: "DELETE",
    })
      .then((response) => {
        console.log(response);
        setAllSprints(allSprints.filter(sprint => sprint.sprintId !== sprintId));
      })
      .catch((error) => {
        console.log(error);
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
                style={{ height: "45rem" }}
              >
                <div className="card-header">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-6">
                        <h1>All Sprints</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">All Sprints</li>
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
                                  onClick={() => editSprint(sprint.sprintId)}
                                  className="btn btn-sm bg-color custom-bg-text mx-1"
                                  style={{
                                    backgroundColor: "#f4a62a",
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                  title="Edit Sprint"
                                >
                                  <i className="nav-icon fas fa-edit" />
                                </button>
                                <button
                                  onClick={() => handleDelete(sprint.sprintId)}
                                  className="btn btn-sm bg-color custom-bg-text"
                                  style={{
                                    backgroundColor: "#df3333",
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                  title="Remove Sprint"
                                >
                                  <i className="nav-icon fas fa-trash" />
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
      <ConfirmDialog isOpen={isDialogOpen} onConfirm={handleConfirm} onCancel={handleCancel} />
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

export default ViewAllSprints;
