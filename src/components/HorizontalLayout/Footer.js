import React from "react"
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap"
import { Link } from "react-router-dom"

import classnames from "classnames"

import logoSM from "assets/images/logos/smlogo.png"
import logoLG from "assets/images/logos/lglogo.png"
import discordLogo from "assets/images/icons/discord.png"

const Footer = props => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid>
          <Row className="mt-3 pb-2">
            <Col md={{ span: 3, order: "first" }}>
              <div className="footer-brand-box mb-3">
                <Link to="/" className="logo-footer logo-dark">
                  <span className="logo-sm">
                    <img src={logoSM} alt="" height="25px" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoLG} alt="" height="80px" />
                  </span>
                </Link>

                <Link to="/" className="logo-footer logo-light">
                  <span className="logo-sm">
                    <img src={logoSM} alt="" height="25px" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoLG} alt="" height="80px" />
                  </span>
                </Link>
              </div>
            </Col>

            <Col lg={2} className="d-flex align-items-end mb-lg-2">
              <ul className="list-unstyled d-flex mb-2">
                <li className="ms-2">
                  <a
                    href="https://twitter.com/Sparklaunchapp"
                    target="_blank"
                  >
                    <i className="bx bxl-twitter fs-3" />
                  </a>
                </li>

                <li className="ms-2">
                  <a href="https://discord.gg/ax92gRTnUF" target="_blank">
                    <img src={discordLogo} alt="discord" />
                  </a>
                </li>

                <li className="ms-2">
                  <a href="https://t.me/sparklaunch" target="_blank">
                    <i className="bx bxl-telegram fs-3" />
                  </a>
                </li>
              </ul>
            </Col>

            <Col md={4} className="">
              <Navbar className="p-0 navbar-dark footer-nav mb-1">
                <Nav className="d-flex w-100 px-2">
                  <Link
                    to="/"
                    className={classnames("nav-link me-3 px-0", {
                      active:
                        window.location.pathname === "/" ||
                        window.location.pathname === "/",
                    })}
                  >
                    HOME
                  </Link>

                  <a
                    href="/#pools"
                    className={classnames("nav-link me-3 px-0", {
                      active: window.location.pathname === "/history",
                    })}
                  >
                    POOLS
                  </a>
                  <a
                    href="https://spark-launch.gitbook.io/"
                    target="_blank"
                    className={classnames("nav-link me-3 px-0", {
                      active: window.location.pathname === "/payments",
                    })}>
                    ABOUT
                  </a>

                  <Link
                    to="/token-locker"
                    className={classnames("nav-link me-3 px-0", {
                      active: window.location.pathname === "/payments",
                    })}
                  >
                    TOKEN LOCKER
                  </Link>
                </Nav>
              </Navbar>

              <Row className="mx-1 text-white mt-4">
                <Col md={6} className="mb-2" style={{ fontSize: 10 }}>
                  @ Copyright DEFI 2022
                </Col>

                <Col md={6} className="mb-2" style={{ fontSize: 10 }}>
                  <a href="https://spark-launch.gitbook.io/docs/important-information/privacy-policy">
                    Privacy Policy
                  </a>
                </Col>

                <Col md={6} className="mb-2" style={{ fontSize: 10 }}>
                  Proudly made by Ignite Defi
                </Col>

                <Col md={6} className="mb-2" style={{ fontSize: 10 }}>
                  <a href="https://spark-launch.gitbook.io/docs/important-information/terms-of-service">
                    Terms of Use
                  </a>
                </Col>
              </Row>
            </Col>

            <Col md={3}>
              <form>
                <div className="form-group">
                  <label> Subscribe to our Newsletter</label>
                  <input
                    className="form-control"
                    placeholder="Enter your e-mail"
                  />
                </div>

                <button className="btn btn-sm btn-primary text-white mt-3">
                  Subscribe
                </button>
              </form>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
