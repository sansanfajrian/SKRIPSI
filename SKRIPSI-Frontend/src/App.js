import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./NavbarComponent/Header";
import AddProject from "./ProjectComponent/AddProject";
import AssignProjectToEmployee from "./ProjectComponent/AssignProjectToEmployee";
import AssignProjectToManager from "./ProjectComponent/AssignProjectToManager";
import UpdateProjectStatus from "./ProjectComponent/UpdateProjectStatus";
import ViewAllEmployeeProjects from "./ProjectComponent/ViewAllEmployeeProjects";
import ViewAllManagerProjects from "./ProjectComponent/ViewAllManagerProjects";
import ViewAllProjects from "./ProjectComponent/ViewAllProjects";
import ChangePassword from "./UserComponent/ChangePassword";
import UserLoginForm from "./UserComponent/UserLoginForm";
import UserRegister from "./UserComponent/UserRegister";
import ViewAllEmployees from "./UserComponent/ViewAllEmployees";
import ViewAllManagers from "./UserComponent/ViewAllManagers";
import AboutUs from "./page/AboutUs";
import ContactUs from "./page/ContactUs";
import HomePage from "./page/HomePage";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<UserLoginForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="user/admin/register" element={<UserRegister />} />
        <Route path="user/employee/register" element={<UserRegister />} />
        <Route path="user/manager/register" element={<UserRegister />} />
        <Route path="user/admin/manager/all" element={<ViewAllManagers />} />
        <Route path="user/employee/all" element={<ViewAllEmployees />} />
        <Route path="/user/login" element={<UserLoginForm />} />
        <Route path="/user/admin/project/add" element={<AddProject />} />
        <Route path="/user/admin/project/all" element={<ViewAllProjects />} />
        <Route
          path="/user/manager/project/all"
          element={<ViewAllManagerProjects />}
        />
        <Route
          path="/user/employee/project/all"
          element={<ViewAllEmployeeProjects />}
        />
        <Route
          path="/project/assign/manager"
          element={<AssignProjectToManager />}
        />
        <Route
          path="/project/assign/employee"
          element={<AssignProjectToEmployee />}
        />
        <Route
          path="/employee/project/status/update"
          element={<UpdateProjectStatus />}
        />
        <Route path="/user/change/password" element={<ChangePassword />} />
      </Routes>
    </div>
  );
}

export default App;
