import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div>
      <div className="container my-5">
        <footer className="text-center text-lg-start text-color">
          <div className="container-fluid p-4 pb-0">
            <section className="">
              <div className="row">
                <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase text-color">
                    Monitoring Project
                  </h5>

                  <p>
                    A Monitoring Project is a powerful tool designed to help
                    individuals and teams efficiently organize, track, and
                    accomplish their tasks and projects.
                  </p>
                </div>

                <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase text-color-4">About us</h5>

                  <ul className="list-unstyled mb-0">
                    <li>
                      <a href="#!" className="text-color">
                        Link 1
                      </a>
                    </li>
                    <li>
                      <a href="#!" className="text-color">
                        Link 2
                      </a>
                    </li>
                    <li>
                      <a href="#!" className="text-color">
                        Link 3
                      </a>
                    </li>
                    <li>
                      <a href="#!" className="text-color">
                        Link 4
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase text-color-4">Contact us</h5>

                  <ul className="list-unstyled mb-0">
                    <li>
                      <a href="#!" className="text-color">
                        Link 1
                      </a>
                    </li>
                    <li>
                      <a href="#!" className="text-color">
                        Link 2
                      </a>
                    </li>
                    <li>
                      <a href="#!" className="text-color">
                        Link 3
                      </a>
                    </li>
                    <li>
                      <a href="#!" className="text-color">
                        Link 4
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase text-color-4">Careers</h5>

                  <ul className="list-unstyled mb-0">
                    <li>
                      <a href="#!" className="text-color">
                        Link 1
                      </a>
                    </li>
                    <li>
                      <a href="#!" className="text-color">
                        Link 2
                      </a>
                    </li>
                    <li>
                      <a href="#!" className="text-color">
                        Link 3
                      </a>
                    </li>
                    <li>
                      <a href="#!" className="text-color">
                        Link 4
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase text-color-4">Links</h5>

                  <ul className="list-unstyled mb-0">
                    <li>
                      <a href="#!" className="text-color">
                        Link 1
                      </a>
                    </li>
                    <li>
                      <a href="#!" className="text-color">
                        Link 2
                      </a>
                    </li>
                    <li>
                      <a href="#!" className="text-color">
                        Link 3
                      </a>
                    </li>
                    <li>
                      <a href="#!" className="text-color">
                        Link 4
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="mb-4" />

            <section className="">
              <p className="d-flex justify-content-center align-items-center">
                <span className="me-3 text-color">Login from here</span>
                <Link to="/user/login" className="active">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-rounded bg-color custom-bg-text"
                  >
                    Log in
                  </button>
                </Link>
              </p>
            </section>

            <hr className="mb-4" />
          </div>

          <div className="text-center">
            © 2022 Copyright:
            <a className="text-color-3" href="https://codewithmurad.com/">
              codewithmurad.com
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
