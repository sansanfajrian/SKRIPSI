import { useState, useRef, useEffect } from "react";
import axios from "axios";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import $ from 'jquery';
import 'datatables.net-bs4';

const ViewAllManagers = () => {
  const [allManagers, setAllManagers] = useState([]);

  const tableRef = useRef(null);

  useEffect(() => {
    const getAllManager = async () => {
      const allManager = await retrieveAllManagers();
      if (allManager) {
        setAllManagers(allManager.users);
      }
    };

    setTimeout(() => {
      $(tableRef.current).DataTable(
        {
            paging: true,
            lengthChange: false,
            searching: false,
            ordering: false,
            autoWidth: true,
            responsive: true,
        }
      )
    },200);

    getAllManager();
  }, []);

  const retrieveAllManagers = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/manager/all"
    );
    console.log(response.data);
    return response.data;
  };

  const deleteManager = (userId) => {
    fetch("http://localhost:8080/api/user/delete?userId=" + userId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            console.log("Got the success response");

            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else {
            console.log("Failed to delete the employee");
            toast.error("It seems server is down", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

    setTimeout(() => {
      window.location.reload(true);
    }, 2000); // Reload after 3 seconds 3000
  };


  return (
    <div className="content-wrapper">

      <section className="content-header">
      </section>

      <section class="content">
        <div className="container-fluid">
          <div
            className="card form-card ms-2 me-2 mb-5 custom-bg border-color "
            style={{
              height: "45rem",
            }}
          >
            <div className="card-header">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-6">
                        <h1>All Managers</h1>
                      </div>
                      <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" style={{backgroundColor: 'transparent'}}>
                          <li className="breadcrumb-item" ><a href="#">Home</a></li>
                          <li className="breadcrumb-item active">View Managers</li>
                        </ol>
                      </div>
                    </div>
                  </div>
              </div>
            <div
              className="card-body"
              style={{
                overflowY: "auto",
              }}
            >
              <div className="table-responsive">
                <table ref={tableRef} className="table table-bordered table-hover">
                  <thead className="table-bordered border-color bg-color custom-bg-text">
                    <tr className="text-center">
                      <th scope="col">First Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">Email Id</th>
                      <th scope="col">Phone No</th>
                      <th scope="col">Address</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allManagers.map((manager) => {
                      return (
                        <tr>
                          <td>
                            <b>{manager.firstName}</b>
                          </td>

                          <td>
                            <b>{manager.lastName}</b>
                          </td>
                          <td>
                            <b>{manager.emailId}</b>
                          </td>
                          <td className="text-center">
                            <b>{manager.contact}</b>
                          </td>

                          <td>
                            <b>
                              {manager.street +
                                " " +
                                manager.city +
                                " " +
                                manager.pincode}
                            </b>
                          </td>
                          <td className="text-center">
                            <button
                              onClick={() => deleteManager(manager.id)}
                              className="btn btn-sm bg-color custom-bg-text"
                              style={{backgroundColor: "#3393df", color: "white", fontWeight: "bold"}}
                            >
                              Remove
                            </button>
                            <ToastContainer />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewAllManagers;
