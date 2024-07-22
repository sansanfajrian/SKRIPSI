import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import avatar from '../images/user.png';

const MenuEmployee = () => {
  let navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-employee"));
  console.log(user);
  console.log(localStorage.getItem("accessToken"));
  const username = JSON.parse(sessionStorage.getItem("username"));

  const employeeLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    sessionStorage.removeItem("active-employee");
    sessionStorage.removeItem("employee-jwtToken");
    sessionStorage.removeItem("username");
    navigate("/user/login");
    window.location.reload(true);
  };

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="index3.html" className="brand-link text-center">
          <i>
            <b className="">Monitoring Project</b>
          </i>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img src={avatar} className="img-circle elevation-2" alt="User Image" />
            </div>
            <div className="info">
              <a href="#" className="d-block">{username}</a>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-item has-treeview">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-project-diagram" />
                  <p>
                    Project
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/user/employee/project/all" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>All Project</p>
                    </Link>
                  </li>
                </ul>
              </li>
              {/* Sprint */}
              <li className="nav-item has-treeview">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-running" />
                  <p>
                    Sprint
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/user/employee/sprint/all" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>All Sprint</p>
                    </Link>
                  </li>
                </ul>
              </li>
              {/* Story */}
              <li className="nav-item has-treeview">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-book" />
                  <p>
                    Story
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/user/employee/story/all" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>All Stories</p>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item has-treeview">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-tasks" />
                  <p>
                    Backlog
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/user/employee/backlog/all" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>All Backlog Items</p>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item has-treeview">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-sync-alt" />
                  <p>
                    Retrospective
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/user/employee/retrospective/add" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Add Retrospective</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/user/employee/retrospective/all" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>All Retrospectives</p>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item has-treeview">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-tasks" />
                  <p>
                    Daily Report
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/user/employee/dailyreport/add" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Add Daily Report</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/user/employee/dailyreport/all" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>All Daily Reports</p>
                    </Link>
                  </li>
                </ul>
              </li>
              {/* Issue */}
              <li className="nav-item has-treeview">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-exclamation-circle" />
                  <p>
                    Issue
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/user/employee/issue/add" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Add Issue</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/user/employee/issue/all" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>All Issues</p>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link to="" onClick={employeeLogout} className="nav-link">
                  <i className="nav-icon fas fa-arrow-right" />
                  <p>
                    Logout
                  </p>
                </Link>
                <ToastContainer />
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>

    </div>
  );
};

export default MenuEmployee;
