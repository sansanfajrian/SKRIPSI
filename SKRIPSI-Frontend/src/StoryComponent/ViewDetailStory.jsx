import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../constants";
import { request } from "../util/APIUtils";

const ViewDetailStory = () => {
  const { id } = useParams(); // Ambil ID story dari URL
  const [storyDetails, setStoryDetails] = useState({
    code: "",
    name: "",
    status: "",
    projectId: "",
  });

  useEffect(() => {
    // Ambil detail story dari backend berdasarkan ID
    request({
      url: API_BASE_URL + `/api/story/get/${id}`,
      method: "GET",
    })
      .then((response) => {
        console.log("Story details API response:", response); // Log response
        // Set nilai state dengan data story yang diterima
        setStoryDetails({
          code: response.code,
          name: response.name,
          status: response.status,
          projectId: response.projectId,
        });
      })
      .catch((error) => {
        console.error("Error fetching story details:", error);
      });
  }, [id]); // Tambahkan id ke dependency array untuk reload saat id berubah

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
                        <h1>Story Details</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{ backgroundColor: "transparent" }}>
                          <li className="breadcrumb-item">
                            <Link to="/">Home</Link>
                          </li>
                          <li className="breadcrumb-item active">
                            Story Details
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <form>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="code" className="form-label">
                        Story Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="code"
                        value={storyDetails.code}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Story Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={storyDetails.name}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="status"
                        value={storyDetails.status}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="projectId" className="form-label">
                        Project ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="projectId"
                        value={storyDetails.projectId}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="card-footer">
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

export default ViewDetailStory;
