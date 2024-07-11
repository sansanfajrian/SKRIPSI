import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MenuAdmin = () => {
  let navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-admin"));
  console.log(localStorage.getItem("accessToken"));

  const username = JSON.parse(sessionStorage.getItem("username"));
  const image_url = user.imageUrl;

  const adminLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    sessionStorage.removeItem("active-admin");
    sessionStorage.removeItem("admin-jwtToken");
    sessionStorage.removeItem("username");
    navigate("/user/login");
    window.location.reload(true);
  };

  return (
    <div className="sidebar-mini">
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="" className="brand-link text-center">
          <i>
            <b className="">Monitoring Project</b>
          </i>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img src={image_url} className="img-circle elevation-2" alt="User Image" />
            </div>
            <div className="info">
              <a href="#" className="d-block">{username}</a>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              {/* Project */}
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
                    <Link to="/user/admin/project/add" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Add Project</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/user/admin/project/all" className="nav-link">
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
                    <Link to="/user/admin/sprint/add" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Add Sprint</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/user/admin/sprint/all" className="nav-link">
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
                    <Link to="/user/admin/story/add" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Add Story</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/user/admin/story/all" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>All Stories</p>
                    </Link>
                  </li>
                </ul>
              </li>
              {/* Manager */}
              <li className="nav-item has-treeview">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-user-tie" />
                  <p>
                    Manager
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/user/manager/menu-register" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Add Manager</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/user/manager/all" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>All Manager</p>
                    </Link>
                  </li>
                </ul>
              </li>
              {/* Employee */}
              <li className="nav-item has-treeview">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-users" />
                  <p>
                    Employee
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/user/employee/menu-register" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Add Employee</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/user/employee/all" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>All Employee</p>
                    </Link>
                  </li>
                </ul>
              </li>
              {/* Logout */}
              <li className="nav-item">
                <Link to="" onClick={adminLogout} className="nav-link">
                  <i className="nav-icon fas fa-arrow-right" />
                  <p>Logout</p>
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

export default MenuAdmin;
