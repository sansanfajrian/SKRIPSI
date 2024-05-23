import React from 'react'
import { Route, Routes } from "react-router-dom";
import AddProject from "./ProjectComponent/AddProject";
import EditProject from "./ProjectComponent/EditProject";
import AssignProjectToEmployee from "./ProjectComponent/AssignProjectToEmployee";
import AssignProjectToManager from "./ProjectComponent/AssignProjectToManager";
import UpdateProjectStatus from "./ProjectComponent/UpdateProjectStatus";
import ViewAllEmployeeProjects from "./ProjectComponent/ViewAllEmployeeProjects";
import ViewAllManagerProjects from "./ProjectComponent/ViewAllManagerProjects";
import ViewAllProjects from "./ProjectComponent/ViewAllProjects";
import MenuChangePassword from "./UserComponent/MenuChangePassword";
import ChangePassword from "./UserComponent/ChangePassword";
import ForgotPassword from "./UserComponent/ForgotPassword";
import UserLoginForm from "./UserComponent/UserLoginForm";
import UserRegister from "./UserComponent/UserRegister";
import ManagerEmployeeRegister from "./UserComponent/ManagerEmployeeRegister";
import ViewAllEmployees from "./UserComponent/ViewAllEmployees";
import ViewAllManagers from "./UserComponent/ViewAllManagers";
import AboutUs from "./page/AboutUs";
import ContactUs from "./page/ContactUs";
import HomePage from "./page/HomePage";

export default function Content() {
    return (
      
      <div className="wrapper">
        <Routes>
        <Route path="/" element={<UserLoginForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="user/admin/register" element={<UserRegister />} />
        <Route path="user/employee/register" element={<UserRegister />} />
        <Route path="user/manager/register" element={<UserRegister />} />
        <Route path="user/employee/menu-register" element={<ManagerEmployeeRegister />} />
        <Route path="user/manager/menu-register" element={<ManagerEmployeeRegister />} />
        <Route path="user/admin/manager/all" element={<ViewAllManagers />} />
        <Route path="user/employee/all" element={<ViewAllEmployees />} />
        <Route path="/user/login" element={<UserLoginForm />} />
        <Route path="/user/admin/project/add" element={<AddProject />} />
        <Route path="/user/admin/project/edit" element={<EditProject />} />
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
        <Route path="/user/change/menu-password" element={<MenuChangePassword />} />
        <Route path="/user/change/password" element={<ChangePassword />} />
        <Route path="/user/forgot/password" element={<ForgotPassword />} />
      </Routes>

    </div>
    )
}