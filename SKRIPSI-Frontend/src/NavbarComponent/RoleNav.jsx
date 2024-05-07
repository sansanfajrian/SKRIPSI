import Header from "./Header";
import MenuAdmin from "./MenuAdmin";
import MenuManager from "./MenuManager";
import MenuEmployee from "./MenuEmployee";

const RoleNav = () => {
  const employee = JSON.parse(sessionStorage.getItem("active-employee"));
  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const manager = JSON.parse(sessionStorage.getItem("active-manager"));

  if (admin != null) {
    return (<div> <Header /> <MenuAdmin /></div>);
  } else if (manager != null) {
    return (<div> <Header /> <MenuManager /></div>);
  } else if (employee != null) {
    return (<div> <Header /> <MenuEmployee /></div>);
  } else {
    return;
  }
};

export default RoleNav;
