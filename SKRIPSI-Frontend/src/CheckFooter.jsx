import Footer from "./footer";

const CheckFooter = () => {
  const employee = JSON.parse(sessionStorage.getItem("active-employee"));
  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const manager = JSON.parse(sessionStorage.getItem("active-manager"));

  if (admin != null) {
    return (<Footer />);
  } else if (manager != null) {
    return <Footer />;
  } else if (employee != null) {
    return <Footer />;
  } else {
    return;
  }
};

export default CheckFooter;
