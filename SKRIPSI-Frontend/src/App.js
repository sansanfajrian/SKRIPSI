import { Route, Routes } from "react-router-dom";
import "./App.css";
import logo from "./images/task_logo.png";
import Header from "./NavbarComponent/Header";
import RoleNav from "./NavbarComponent/RoleNav";
import Content from "./content";
import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/plugins/fontawesome-free/css/all.min.css';
import 'admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css';
import 'admin-lte/dist/js/adminlte.min.js';

function App() {
  return (
    <div className="wrapper">

      <div className="preloader flex-column justify-content-center align-items-center">
        <img className="animation__shake" src={logo} alt="Tujuh Sembilan" height="auto" width="auto" />
      </div>
      
      <RoleNav />
      <Content />
    </div>
  );
}

export default App;
