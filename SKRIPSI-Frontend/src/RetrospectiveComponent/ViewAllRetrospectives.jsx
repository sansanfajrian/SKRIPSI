import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewAllRetrospectives = () => {
  const [allRetrospectives, setAllRetrospectives] = useState([]);
  const [retrospectiveId, setRetrospectiveId] = useState("");
  const [deleteRetrospectiveId, setDeleteRetrospectiveId] = useState("");
  const navigate = useNavigate();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = allRetrospectives.slice(firstIndex, lastIndex);
  const npage = Math.ceil(allRetrospectives.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  useEffect(() => {
    const getAllRetrospectives = async () => {
      const retrospectives = await retrieveAllRetrospectives();
      if (retrospectives) {
        setAllRetrospectives(retrospectives);
      }
    };
    getAllRetrospectives();
  }, []);

  const retrieveAllRetrospectives = async () => {
    const retrospectives = await request({
      url: API_BASE_URL + "/api/retrospective/fetch",
      method: "GET",
    })
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error);
      });

    return retrospectives;
  };

  const searchRetrospectiveById = async () => {
    const retrospectives = await retrieveRetrospectivesById();
    if (retrospectives) {
      setAllRetrospectives(retrospectives);
    }
  };

  const retrieveRetrospectivesById = async () => {
    const retrospectives = await request({
      url:
        API_BASE_URL +
        "/api/retrospective/search/id?retrospectiveId=" +
        (retrospectiveId === "" ? 0 : retrospectiveId),
      method: "GET",
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });

    return retrospectives;
  };

  const searchRetrospective = (e) => {
    searchRetrospectiveById();
    setRetrospectiveId("");
    e.preventDefault();
  };

  const editRetrospective = (retrospectiveId) => {
    navigate(`/user/admin/retrospective/edit/${retrospectiveId}`);
  };

  const handleDelete = (retrospectiveId) => {
    setDialogOpen(true);
    setDeleteRetrospectiveId(retrospectiveId);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    deleteRetrospective(deleteRetrospectiveId)
      .then(() => {
        toast.warning("Retrospective deleted successfully", {
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

  const deleteRetrospective = (retrospectiveId) => {
    return request({
      url: API_BASE_URL + "/api/retrospective/delete/" + retrospectiveId,
      method: "DELETE",
    })
      .then((response) => {
        console.log(response);
        setAllRetrospectives(
          allRetrospectives.filter(
            (retrospective) => retrospective.retrospectiveId !== retrospectiveId
          )
        );
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
                        <h1>All Retrospectives</h1>
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
                            All Retrospectives
                          </li>
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
                            type="number"
                            className="form-control"
                            placeholder="Enter Retrospective Id..."
                            onChange={(e) => setRetrospectiveId(e.target.value)}
                            value={retrospectiveId}
                            required
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn bg-color mb-3"
                            onClick={searchRetrospective}
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
                          <th scope="col">Sprint</th>
                          <th scope="col">From</th>
                          <th scope="col">To</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((retrospective, i) => (
                          <tr key={i}>
                            <td className="text-center">
                              <b>{retrospective.projectName}</b>
                            </td>
                            <td className="text-center">
                              <b>{retrospective.sprintName}</b>
                            </td>
                            <td className="text-center">
                              <b>{retrospective.from}</b>
                            </td>
                            <td className="text-center">
                              <b>{retrospective.to}</b>
                            </td>
                            <td className="text-center">
                              <span
                                className={`badge ${
                                  retrospective.status === "Start"
                                    ? "bg-primary"
                                    : retrospective.status === "Continue"
                                    ? "bg-warning"
                                    : retrospective.status === "Stop"
                                    ? "bg-danger"
                                    : ""
                                }`}
                              >
                                {retrospective.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <div>
                                <button
                                  onClick={() =>
                                    editRetrospective(
                                      retrospective.retrospectiveId
                                    )
                                  }
                                  className="btn btn-sm bg-color custom-bg-text mx-1"
                                  style={{
                                    backgroundColor: "#f4a62a",
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                  title="Edit Retrospective"
                                >
                                  <i className="nav-icon fas fa-edit" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(
                                      retrospective.retrospectiveId
                                    )
                                  }
                                  className="btn btn-sm bg-color custom-bg-text"
                                  style={{
                                    backgroundColor: "#df3333",
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                  title="Remove Retrospective"
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

export default ViewAllRetrospectives;
