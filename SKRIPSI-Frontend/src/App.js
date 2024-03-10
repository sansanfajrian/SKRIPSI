import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Navbar from "./layout/navbar";
import Home from "./pages/Home";
import OAuthLogin from "./pages/OAuthLogin"; // Import OAuthLogin component
import OAuth2LoginSuccess from "./pages/OAuth2LoginSuccess";
import AddUser from "./users/AddUser";
import EditUser from "./users/EditUser";
import ViewUser from "./users/ViewUser";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<OAuthLogin />} /> {/* Route for OAuth login */}
          <Route exact path="/login/oauth2/google" element={<OAuth2LoginSuccess />} />
          <Route exact path="/home" element={<Home />} /> {/* Route for Home */}
          <Route exact path="/adduser" element={<AddUser />} />
          <Route exit path="/edituser/:id" element={<EditUser />} />
          <Route exact path="/viewuser/:id" element={<ViewUser />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
