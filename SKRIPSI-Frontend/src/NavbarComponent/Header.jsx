import { Link } from "react-router-dom";
import RoleNav from "./RoleNav";
import logo from "../images/task_logo.png";

const Header = () => {
  return (
    <div>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <div className="container-fluid text-color">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#nothing" role="button"><i className="fas fa-bars" /></a>
                </li>
                <Link to="/" className="navbar-brand ms-1">
                  <img src={logo} width="120" height="auto" alt="Logo Tujuh Sembilan" className="brand-image" style={{opacity: '.8'}} />
                </Link>
            </ul>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0">
               <li className="nav-item">
                <Link
                  to="/about"
                  className="nav-link active"
                  aria-current="page"
                >
                  <b className="text-color">About Us</b>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/contact"
                  className="nav-link active"
                  aria-current="page"
                >
                  <b className="text-color">Contact Us</b>
                </Link>
              </li> }
            </ul> */}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
