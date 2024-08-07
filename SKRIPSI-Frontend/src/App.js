import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/dist/js/adminlte.min.js';
import 'admin-lte/plugins/fontawesome-free/css/all.min.css';
import 'admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import CheckFooter from "./CheckFooter";
import RoleNav from "./NavbarComponent/RoleNav";
import Content from "./content";
import logo from "./images/task_logo.png";

function App() {
  return (
    <div style={{height: "100%"}}>
      <div className="wrapper">

        <div className="preloader flex-column justify-content-center align-items-center">
          <img className="animation__shake" src={logo} alt="Tujuh Sembilan" height="auto" width="auto" />
        </div>
        
        <RoleNav />
        <Content />
        <CheckFooter />
      </div>
    </div>
  );
}

export default App;
