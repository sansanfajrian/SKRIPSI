import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewAllDailyReports = () => {
  const [allDailyReports, setAllDailyReports] = useState([]);
  const [dailyReportId, setDailyReportId] = useState("");
  const [deleteDailyReportId, setDeleteDailyReportId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = allDailyReports.slice(firstIndex, lastIndex);
  const npage = Math.ceil(allDailyReports.length / recordsPerPage);
  const navigate = useNavigate();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  useEffect(() => {
    const getAllDailyReports = async () => {
      const dailyReports = await retrieveAllDailyReports();
      if (dailyReports) {
        setAllDailyReports(dailyReports);
      }
    };
    getAllDailyReports();
  }, []);

  const retrieveAllDailyReports = async () => {
    try {
      const response = await request({
        url: API_BASE_URL + "/api/dailyreport/fetch",
        method: "GET",
      });
      return response;
    } catch (error) {
      console.error("Error fetching daily reports:", error);
    }
  };

  const searchDailyReportById = async () => {
    const dailyReports = await retrieveDailyReportsById();
    if (dailyReports) {
      setAllDailyReports(dailyReports);
    }
  };

  const retrieveDailyReportsById = async () => {
    try {
      const response = await request({
        url:
          API_BASE_URL +
          "/api/dailyreport/search/id?dailyReportId=" +
          (dailyReportId === "" ? 0 : dailyReportId),
        method: "GET",
      });
      return response;
    } catch (error) {
      console.error("Error searching daily reports by ID:", error);
    }
  };

  const searchDailyReport = (e) => {
    searchDailyReportById();
    setDailyReportId("");
    e.preventDefault();
  };

  const editDailyReport = (dailyReportId) => {
    navigate(`/user/admin/dailyreport/edit/${dailyReportId}`);
  };

  const handleDelete = (dailyReportId) => {
    setDialogOpen(true);
    setDeleteDailyReportId(dailyReportId);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    deleteDailyReport(deleteDailyReportId)
      .then(() => {
        toast.warning("Daily Report deleted successfully", {
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
        console.error("Error deleting daily report:", error);
      });
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const deleteDailyReport = (dailyReportId) => {
    return request({
      url: API_BASE_URL + "/api/dailyreport/delete/" + dailyReportId,
      method: "DELETE",
    })
      .then((response) => {
        console.log(response);
        setAllDailyReports(
          allDailyReports.filter(
            (dailyReport) => dailyReport.dailyReportId !== dailyReportId
          )
        );
      })
      .catch((error) => {
        console.error("Error deleting daily report:", error);
      });
  };

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const changeCPage = (n) => {
    setCurrentPage(n);
  };

  return (
    <div className="content-wrapper">
      <section className="content-header"></section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div
                className="card form-card ms-2 me-2 mb-5 custom-bg border-color"
                style={{ height: "45rem" }}
              >
                <div className="card-header">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-6">
                        <h1>All Daily Reports</h1>
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
                            All Daily Reports
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
                            placeholder="Enter Daily Report Id..."
                            onChange={(e) => setDailyReportId(e.target.value)}
                            value={dailyReportId}
                            required
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn bg-color mb-3"
                            onClick={searchDailyReport}
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
                          <th scope="col">Task Details</th>
                          <th scope="col">Notes</th>
                          <th scope="col">Status</th>
                          <th scope="col">Add Effort</th>
                          <th scope="col">Act Effort</th>
                          <th scope="col">Est Effort</th>
                          <th scope="col">ACM Add Effort</th>
                          <th scope="col">ACM Act Effort</th>
                          <th scope="col">Curr Task Progress (%)</th>
                          <th scope="col">Init Task Progress (%)</th>
                          <th scope="col">User Name</th>
                          <th scope="col">Backlog Name</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((dailyReport, i) => (
                          <tr key={i}>
                            <td className="text-center">
                              <b>{dailyReport.projectName}</b>
                            </td>
                            <td className="text-center">
                              <b>{dailyReport.sprintName}</b>
                            </td>
                            <td className="text-center">
                              <b>{dailyReport.taskDetails}</b>
                            </td>
                            <td className="text-center">
                              <b>{dailyReport.notes}</b>
                            </td>
                            <td className="text-center">
                              <span
                                className={`badge ${
                                  dailyReport.status === "To Do"
                                    ? "bg-primary"
                                    : dailyReport.status === "In Progress"
                                    ? "bg-warning"
                                    : dailyReport.status === "Done"
                                    ? "bg-success"
                                    : dailyReport.status === "Hold"
                                    ? "bg-danger"
                                    : ""
                                }`}
                              >
                                {dailyReport.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <b>{dailyReport.addEffort}</b>
                            </td>
                            <td className="text-center">
                              <b>{dailyReport.actEffort}</b>
                            </td>
                            <td className="text-center">
                              <b>{dailyReport.estEffort}</b>
                            </td>
                            <td className="text-center">
                              <b>{dailyReport.acmAddEffort}</b>
                            </td>
                            <td className="text-center">
                              <b>{dailyReport.acmActEffort}</b>
                            </td>
                            <td className="text-center">
                              <b>{Math.floor(dailyReport.currTaskProgress)}%</b>
                            </td>
                            <td className="text-center">
                              <b>{Math.floor(dailyReport.initTaskProgress)}%</b>
                            </td>
                            <td className="text-center">
                              <b>{dailyReport.userName}</b>
                            </td>
                            <td className="text-center">
                              <b>{dailyReport.backlogName}</b>
                            </td>
                            <td className="text-center">
                            <button
                                onClick={() =>
                                  editDailyReport(dailyReport.dailyReportId)
                                }
                                className="btn btn-sm bg-color custom-bg-text mx-1"
                                  style={{
                                    backgroundColor: "#f4a62a",
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                  title="Edit Daily Report"
                                >
                                  <i className="nav-icon fas fa-edit" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(dailyReport.dailyReportId)
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer bg-white border-top">
                  <div className="row">
                    <div className="col">
                      <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={prePage}>
                              Previous
                            </button>
                          </li>
                          {numbers.map((n) => (
                            <li
                              className={`page-item ${
                                currentPage === n ? "active" : ""
                              }`}
                              key={n}
                            >
                              <button
                                className="page-link"
                                onClick={() => changeCPage(n)}
                              >
                                {n}
                              </button>
                            </li>
                          ))}
                          <li className={`page-item ${currentPage === npage ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={nextPage}>
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
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

export default ViewAllDailyReports;
