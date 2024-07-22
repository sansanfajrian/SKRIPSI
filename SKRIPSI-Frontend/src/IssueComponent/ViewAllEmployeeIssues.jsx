import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../ConfirmDialog";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewAllIssues = () => {
  const [allIssues, setAllIssues] = useState([]);
  const [issueCode, setIssueCode] = useState("");
  const [deleteIssueId, setDeleteIssueId] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = allIssues.slice(firstIndex, lastIndex);
  const npage = Math.ceil(allIssues.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const navigate = useNavigate();

  useEffect(() => {
    const getAllIssues = async () => {
      try {
        const response = await retrieveAllIssues();
        if (Array.isArray(response.content)) {
          setAllIssues(response.content);
        } else {
          console.error("Expected an array but got", response);
        }
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      }
    };
    getAllIssues();
  }, []);

  const retrieveAllIssues = () => {
    return request({
      url: API_BASE_URL + "/api/issue/fetch/employee",
      method: "GET",
    })
      .then((response) => {
        console.log("Fetched issues:", response);
        return response; // Return the whole response object
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchIssueByCode = async (e) => {
    e.preventDefault();
    try {
      const response = await retrieveIssuesByCode();
      if (Array.isArray(response.content)) {
        setAllIssues(response.content);
      } else {
        console.error("Expected an array but got", response);
      }
    } catch (error) {
      console.error("Failed to search issues:", error);
    }
    setIssueCode("");
  };

  const retrieveIssuesByCode = () => {
    return request({
      url: API_BASE_URL + "/api/issue/search?issueCode=" + issueCode,
      method: "GET",
    })
      .then((response) => {
        console.log("Searched issues:", response);
        return response; // Return the whole response object
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editIssue = (issueId) => {
    navigate(`/user/admin/issue/edit/${issueId}`);
  };

  const handleDelete = (issueId) => {
    setDialogOpen(true);
    setDeleteIssueId(issueId);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    deleteIssue(deleteIssueId)
      .then(() => {
        toast.warning("Issue deleted successfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
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

  const deleteIssue = (issueId) => {
    return request({
      url: API_BASE_URL + "/api/issue/delete/" + issueId,
      method: "DELETE",
    })
      .then((response) => {
        console.log(response);
        setAllIssues(allIssues.filter(issue => issue.issueId !== issueId));
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
                        <h1>All Issues</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">All Issues</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body" style={{ overflowY: "auto" }}>
                  <div className="row g-3">
                    <div className="col-auto">
                      <form className="row g-3" onSubmit={searchIssueByCode}>
                        <div className="col-auto">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Issue Code..."
                            onChange={(e) => setIssueCode(e.target.value)}
                            value={issueCode}
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn mb-3"
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
                          <th scope="col">Issue Code</th>
                          <th scope="col">Issued Sprint</th>
                          <th scope="col">Issued Date</th>
                          <th scope="col">Issuer</th>
                          <th scope="col">Related Task</th>
                          <th scope="col">Issue Title</th>
                          <th scope="col">Issue Desc</th>
                          <th scope="col">Status</th>
                          <th scope="col">Assignee</th>
                          <th scope="col">Closed Date</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.length > 0 ? (
                          records.map((issue, i) => (
                            <tr key={i}>
                              <td className="text-center">{issue.code}</td>
                              <td className="text-center">{issue.sprintName}</td>
                              <td className="text-center">{new Date(issue.issuedDate).toLocaleDateString()}</td>
                              <td className="text-center">{issue.issuerName}</td>
                              <td className="text-center">{issue.backlogCode} - {issue.backlogName}</td>
                              <td className="text-center">{issue.title}</td>
                              <td className="text-center">{issue.description}</td>
                              <td className="text-center">
                                <span className={`badge ${issue.status === 'Closed' ? 'bg-success' : 'bg-warning'}`}>
                                  {issue.status}
                                </span>
                              </td>
                              <td className="text-center">{issue.assigneeName}</td>
                              <td className="text-center">{issue.closedDate ? new Date(issue.closedDate).toLocaleDateString() : '-'}</td>
                              <td className="text-center">
                                <div>
                                  <button
                                    onClick={() => editIssue(issue.id)}
                                    className="btn btn-sm bg-color custom-bg-text mx-1"
                                    style={{
                                      backgroundColor: "#f4a62a",
                                      color: "white",
                                      fontWeight: "bold",
                                    }}
                                    title="Edit Issue"
                                  >
                                    <i className="nav-icon fas fa-edit" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(issue.id)}
                                    className="btn btn-sm bg-color custom-bg-text"
                                    style={{
                                      backgroundColor: "#df3333",
                                      color: "white",
                                      fontWeight: "bold",
                                    }}
                                    title="Remove Issue"
                                  >
                                    <i className="nav-icon fas fa-trash" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="11" className="text-center">
                              No issues found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
        </div>
      </section>
      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message="Are you sure you want to delete this issue?"
      />
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

export default ViewAllIssues;
