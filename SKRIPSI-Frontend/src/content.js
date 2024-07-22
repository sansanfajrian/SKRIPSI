import React from 'react';
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AddBacklog from './BacklogComponent/AddBacklog';
import EditBacklog from './BacklogComponent/EditBacklog';
import ViewAllBacklogs from "./BacklogComponent/ViewAllBacklogs";
import ViewAllEmployeeBacklogs from "./BacklogComponent/ViewAllEmployeeBacklogs";
import ViewDetailBacklog from "./BacklogComponent/ViewDetailBacklog";
import AddDailyReport from './DailyReportComponent/AddDailyReport';
import EditDailyReport from './DailyReportComponent/EditDailyReport';
import ViewAllDailyReports from './DailyReportComponent/ViewAllDailyReports';
import ViewAllEmployeeDailyReports from './DailyReportComponent/ViewAllEmployeeDailyReports';
import AddIssue from './IssueComponent/AddIssue';
import EditIssue from './IssueComponent/EditIssue';
import ViewAllEmployeeIssues from './IssueComponent/ViewAllEmployeeIssues';
import ViewAllIssues from './IssueComponent/ViewAllIssues';
import AddProject from "./ProjectComponent/AddProject";
import AssignProjectToEmployee from "./ProjectComponent/AssignProjectToEmployee";
import AssignProjectToManager from "./ProjectComponent/AssignProjectToManager";
import EditProject from "./ProjectComponent/EditProject";
import UpdateProjectStatus from "./ProjectComponent/UpdateProjectStatus";
import ViewAllEmployeeProjects from "./ProjectComponent/ViewAllEmployeeProjects";
import ViewAllManagerProjects from "./ProjectComponent/ViewAllManagerProjects";
import ViewAllProjects from "./ProjectComponent/ViewAllProjects";
import ViewDetailProject from "./ProjectComponent/ViewDetailProject";
import AddRetrospective from './RetrospectiveComponent/AddRetrospective';
import EditRetrospective from './RetrospectiveComponent/EditRetrospective';
import ViewAllEmployeeRetrospectives from "./RetrospectiveComponent/ViewAllEmployeeRetrospectives";
import ViewAllRetrospectives from "./RetrospectiveComponent/ViewAllRetrospectives";
import ViewDetailRetrospective from "./RetrospectiveComponent/ViewDetailRetrospective";
import AddSprint from './SprintComponent/AddSprint';
import EditSprint from './SprintComponent/EditSprint';
import ViewAllEmployeeSprints from './SprintComponent/ViewAllEmployeeSprints';
import ViewAllSprints from './SprintComponent/ViewAllSprints';
import ViewDetailSprint from './SprintComponent/ViewDetailSprint';
import AddStory from './StoryComponent/AddStory';
import EditStory from './StoryComponent/EditStory';
import ViewAllEmployeeStories from "./StoryComponent/ViewAllEmployeeStories";
import ViewAllStories from "./StoryComponent/ViewAllStories";
import ViewDetailStory from "./StoryComponent/ViewDetailStory";
import ChangePassword from "./UserComponent/ChangePassword";
import EditManagerEmployee from "./UserComponent/EditManagerEmployee";
import ForgotPassword from "./UserComponent/ForgotPassword";
import ManagerEmployeeRegister from "./UserComponent/ManagerEmployeeRegister";
import MenuChangePassword from "./UserComponent/MenuChangePassword";
import OAuth2RedirectHandler from './UserComponent/OAuth2RedirectHandler';
import UserLoginForm from "./UserComponent/UserLoginForm";
import UserRegister from "./UserComponent/UserRegister";
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
        <Route path="user/manager/edit-data" element={<EditManagerEmployee />} />
        <Route path="user/employee/edit-data" element={<EditManagerEmployee />} />
        <Route path="user/manager/all" element={<ViewAllManagers />} />
        <Route path="user/employee/all" element={<ViewAllEmployees />} />
        <Route path="/user/login" element={<UserLoginForm />} />
        <Route path="/user/admin/project/add" element={<AddProject />} />
        <Route path="/user/admin/project/edit/:id" element={<EditProject />} />
        <Route path="/user/employee/project/all" element={<ViewAllEmployeeProjects />}/>
        <Route path="/user/admin/project/all" element={<ViewAllProjects />} />
        <Route path="/user/employee/project/:id" element={<ViewDetailProject />} />
        <Route path="/user/admin/sprint/all" element={<ViewAllSprints />} />
        <Route path="/user/employee/sprint/all" element={<ViewAllEmployeeSprints />} />
        <Route path="/user/admin/sprint/add" element={<AddSprint />} />
        <Route path="/user/admin/sprint/edit/:id" element={<EditSprint />} />
        <Route path="/user/employee/sprint/:id" element={<ViewDetailSprint />} />
        <Route path="/user/admin/story/all" element={<ViewAllStories />} />
        <Route path="/user/admin/story/add" element={<AddStory />} />
        <Route path="/user/admin/story/edit/:id" element={<EditStory />} />
        <Route path="/user/employee/story/all" element={<ViewAllEmployeeStories />} />
        <Route path="/user/employee/story/:id" element={<ViewDetailStory />} />
        <Route path="/user/admin/retrospective/all" element={<ViewAllRetrospectives />} />
        <Route path="/user/employee/retrospective/add" element={<AddRetrospective />} />
        <Route path="/user/employee/retrospective/edit/:id" element={<EditRetrospective />} />
        <Route path="/user/employee/retrospective/all" element={<ViewAllEmployeeRetrospectives />} />
        <Route path="/user/admin/retrospective/:id" element={<ViewDetailRetrospective />} />
        <Route path="/user/admin/backlog/all" element={<ViewAllBacklogs />} />
        <Route path="/user/admin/backlog/add" element={<AddBacklog />} />
        <Route path="/user/admin/backlog/edit/:id" element={<EditBacklog />} />
        <Route path="/user/employee/backlog/all" element={<ViewAllEmployeeBacklogs />} />
        <Route path="/user/employee/backlog/:id" element={<ViewDetailBacklog />} />
        <Route path="/user/admin/dailyreport/all" element={<ViewAllDailyReports />} />
        <Route path="/user/admin/dailyreport/edit/:id" element={<EditDailyReport />} /> 
        <Route path="/user/employee/dailyreport/all" element={<ViewAllEmployeeDailyReports />} />
        <Route path="/user/employee/dailyreport/add" element={<AddDailyReport />} />
        <Route path="/user/employee/dailyreport/edit/:id" element={<EditDailyReport />} /> 
        <Route path="/user/admin/issue/all" element={<ViewAllIssues />} />
        <Route path="/user/admin/issue/add" element={<AddIssue />} />
        <Route path="/user/admin/issue/edit/:id" element={<EditIssue />} /> 
        <Route path="/user/employee/issue/all" element={<ViewAllEmployeeIssues />} />
        <Route path="/user/employee/issue/add" element={<AddIssue />} />
        <Route path="/user/employee/issue/edit/:id" element={<EditIssue />} /> 
        <Route
          path="/user/manager/project/all"
          element={<ViewAllManagerProjects />}
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

        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      </Routes>

    </div>
    )
}