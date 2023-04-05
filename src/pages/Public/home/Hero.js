import React from "react"
import { Link } from "react-router-dom"
import verticaLogo from "assets/images/logos/biglogo.png"

import { Col, Container, Row } from "react-bootstrap"
const Hero = () => {
  return (
    <>
      <Row className="mb-5">
        <Col md={{ span: 6, offset: 3 }} className="d-flex">
          <img className="img-fluid mx-auto mb-4" src={verticaLogo} />
        </Col>
      </Row>

      <Row className="pt-5 mb-lg-5 mb-3">
        <Col
          xs={12}
          md={12}
          className="text-lg-center text-center mb-5 mb-lg-0"
        >
          <Link
            to="/project-setup"
            className="bg-primary text-black fw-bold p-3 rounded-pill"
          >
            <span className="fs-4 d-none d-lg-inline">LAUNCH TOKEN</span>
            <span className="fs-5 d-lg-none">LAUNCH TOKEN</span>
          </Link>
        </Col>
        <Col xs={12} className="text-center d-lg-none">
          <a
            href="#sales"
            className="border border-2 border-primary text-white fw-bold py-3 px-5 w-lg rounded-pill"
          >
            {" "}
            <span className="fs-5 d-lg-none">BUY $IGHT</span>
          </a>
        </Col>
      </Row>
    </>
  )
}

export default Hero
