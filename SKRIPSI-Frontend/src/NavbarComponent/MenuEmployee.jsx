import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../images/task_logo.png";
import avatar from "../images/user.png";
import RoleNav from "./RoleNav";


const MenuEmployee = () => {
  let navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-employee"));
  console.log(user);
  
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
              
              <li className="nav-item">
                <Link to="/user/employee/project/all" className="nav-link">
                  <i className="nav-icon far fa-folder" />
                  <p>
                    My Project
                    <span className="badge badge-info right">2</span>
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user/change/password" className="nav-link">
                  <i className="nav-icon fas fa-key" />
                  <p>
                    Change Password
                  </p>
                </Link>
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
