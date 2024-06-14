import { useState, useRef, useEffect } from "react";
import axios from "axios";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import 'datatables.net-bs4';
import ConfirmDialog from '../ConfirmDialog';

const ViewAllManagers = () => {
  const [allManagers, setAllManagers] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [managerId, setManagerId] = useState("");

  const tableRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getAllManager = async () => {
      const allManager = await retrieveAllManagers();
      if (allManager) {
        setAllManagers(allManager.users);
      }
    };

    // setTimeout(() => {
    //   $(tableRef.current).DataTable(
    //     {
    //         paging: true,
    //         lengthChange: false,
    //         searching: false,
    //         ordering: false,
    //         autoWidth: true,
    //         responsive: true,
    //     }
    //   )
    // },200);

    getAllManager();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = allManagers.slice(firstIndex, lastIndex);
  const npage = Math.ceil(allManagers.length / recordsPerPage);
  const numbers = [...Array(npage +1).keys()].slice(1);
  
  const retrieveAllManagers = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/manager/all"
    );
    console.log(response.data);
    return response.data;
  };


  const handleDelete = (userID) => {
    setDialogOpen(true);
    setManagerId(userID);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    deleteManager(managerId);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    console.log('Delete action canceled');
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

  const editManager = (manager) => {
    navigate("/user/manager/edit-data", { state: manager });
  };

  return (
    <div className="content-wrapper">

      <section className="content-header">
      </section>

      <section className="content">
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
                    {records.map((manager, i) => {
                      return (
                        <tr key={i}>
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
                          <td className="text-center" width="10%">
                            <button
                              onClick={() => editManager(manager)}
                              className="btn btn-sm bg-color custom-bg-text mx-1"
                              style={{backgroundColor: "#f4a62a", color: "white", fontWeight: "bold"}}
                              title="Edit Manager"
                            >
                              <i className="nav-icon fas fa-edit" />
                            </button>
                            <button
                              onClick={() => handleDelete(manager.id)}
                              className="btn btn-sm bg-color custom-bg-text"
                              style={{backgroundColor: "#df3333", color: "white", fontWeight: "bold"}}
                              title="Remove Manager"
                            >
                              <i className="nav-icon fas fa-trash" />
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
            <div className="card-footer">
                <nav className="float-right">
                  <ul className='pagination'>
                    <li className='page-item'>
                      <a href='#' className='page-link' onClick={prePage}>Prev</a>
                    </li>
                    {numbers.map((n, i) => (
                      <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
                        <a href='#' className='page-link' onClick={() => changeCPage(n)}>{n}</a>
                      </li>
                    ))}
                    <li className='page-item'>
                      <a href='#' className='page-link' onClick={nextPage}>Next</a>
                    </li>
                  </ul>
                </nav>
              </div>
          </div>
        </div>
      </section>

      <ConfirmDialog
          isOpen={isDialogOpen}
          message="Are you sure you want to delete this user ?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />

    </div>
  );

  function prePage(){
    if(currentPage !== 1){
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id){
    setCurrentPage(id);
  }

  function nextPage(){
    if(currentPage !== npage){
      setCurrentPage(currentPage + 1);
    }
  }

};

export default ViewAllManagers;
