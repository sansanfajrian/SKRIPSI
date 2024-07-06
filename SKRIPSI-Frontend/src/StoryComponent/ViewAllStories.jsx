import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../ConfirmDialog";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewAllStories = () => {
  const [allStories, setAllStories] = useState([]);
  const [storyName, setStoryName] = useState("");
  const [storyId, setStoryId] = useState("");
  const [deleteStoryId, setDeleteStoryId] = useState("");
  const navigate = useNavigate();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = allStories.slice(firstIndex, lastIndex);
  const npage = Math.ceil(allStories.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  useEffect(() => {
    const getAllStories = async () => {
      const allStories = await retrieveAllStories();
      if (allStories) {
        setAllStories(allStories);
      }
    };
    getAllStories();
  }, []);

  const retrieveAllStories = () => {
    request({
      url: API_BASE_URL + "/api/story/fetch",
      method: "GET",
    })
      .then((response) => {
        console.log(response);
        setAllStories(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getStoriesByName = async () => {
    const allStories = await retrieveStoriesByName();
    if (allStories) {
      setAllStories(allStories);
    }
  };

  const retrieveStoriesByName = async () => {
    const Stories = await request({
      url: API_BASE_URL + "/api/story/search?storyName=" + storyName,
      method: "GET",
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });

    return Stories;
  };

  const searchStoryByName = (e) => {
    getStoriesByName();
    setStoryName("");
    e.preventDefault();
  };

  const getStoriesById = async () => {
    const allStories = await retrieveStoriesById();
    if (allStories) {
      setAllStories(allStories);
    }
  };

  const retrieveStoriesById = async () => {
    const Stories = await request({
      url: API_BASE_URL + "/api/story/search/id?storyId=" + (storyId === "" ? 0 : storyId),
      method: "GET",
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });

    return Stories;
  };

  const searchStoryById = (e) => {
    getStoriesById();
    setStoryId("");
    e.preventDefault();
  };

  const editStory = (storyId) => {
    navigate(`/user/admin/story/edit/${storyId}`);
  };

  const handleDelete = (storyId) => {
    setDialogOpen(true);
    setDeleteStoryId(storyId);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    deleteStory(deleteStoryId)
      .then(() => {
        toast.warning("Story deleted successfully", {
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

  const deleteStory = (storyId) => {
    return request({
      url: API_BASE_URL + "/api/story/delete/" + storyId,
      method: "DELETE",
    })
      .then((response) => {
        console.log(response);
        setAllStories(allStories.filter(story => story.storyId !== storyId));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "started":
        return <span className="badge badge-primary">Started</span>;
      case "in progress":
        return <span className="badge badge-warning">In Progress</span>;
      case "completed":
        return <span className="badge badge-success">Completed</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
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
                        <h1>All Stories</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <a href="#">Home</a>
                          </li>
                          <li className="breadcrumb-item active">All Stories</li>
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
                            placeholder="Enter Story Name..."
                            onChange={(e) => setStoryName(e.target.value)}
                            value={storyName}
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn mb-3"
                            onClick={searchStoryByName}
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
                            placeholder="Enter Story Id..."
                            onChange={(e) => setStoryId(e.target.value)}
                            value={storyId}
                            required
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn bg-color mb-3"
                            onClick={searchStoryById}
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
                          <th scope="col">Story Name</th>
                          <th scope="col">Code</th>
                          <th scope="col">Status</th>
                          <th scope="col">Project Name</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((story, i) => (
                          <tr key={i}>
                            <td>
                              <b>{story.name}</b>
                            </td>
                            <td className="text-center">
                              <b>{story.code}</b>
                            </td>
                            <td className="text-center">
                              <b>{getStatusLabel(story.status)}</b>
                            </td>
                            <td className="text-center">
                              <b>{story.projectName}</b>
                            </td>
                            <td className="text-center" width="10%">
                              <div>
                                <button
                                  onClick={() => editStory(story.storyId)}
                                  className="btn btn-sm bg-color custom-bg-text mx-1"
                                  style={{
                                    backgroundColor: "#f4a62a",
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                  title="Edit Story"
                                >
                                  <i className="nav-icon fas fa-edit" />
                                </button>
                                <button
                                  onClick={() => handleDelete(story.storyId)}
                                  className="btn btn-sm bg-color custom-bg-text"
                                  style={{
                                    backgroundColor: "#df3333",
                                    color: "white",
                                    fontWeight: "bold",
                                    width: 30,
                                  }}
                                  title="Remove Story"
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

export default ViewAllStories;
