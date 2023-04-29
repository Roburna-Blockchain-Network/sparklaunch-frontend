import React, { useState, useEffect } from "react"
import { MetaTags } from "react-meta-tags"

import { Col, Container, Form, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"

const StaticLocker = () => {
  const PairInfo = [
    {
      label: "Quote Pair",
      image: "/images/tokens/bnb.svg",
      value: "---",
    },
    {
      label: "Base Pair",
      image: "/images/tokens/sxp.svg",
      value: "---",
    },
    {
      label: "Symbol",
      value: "---",
    },
    {
      label: "LP Supply",
      value: "---",
    },
    {
      label: "Dex Listed",
      value: "---",
    },
  ]
  const LockInfo = [
    {
      label: "Title",
      value: "---",
    },
    {
      label: "Total Amount Locked",
      value: "---",
    },
    {
      label: "Total Value Locked",
      value: "---",
    },
    {
      label: "Owner",
      value: "---",
    },
    {
      label: "Lock Date",
      value: "---",
    },
  ]

  return (
    <>
      <div className="page-content">
        <MetaTags>
          <title>Token Locker | SparkLaunch</title>
        </MetaTags>
        <Container fluid>
          <div className="featured-card bg-dark p-4 my-2 rounded-4">
            <Row>
              <Col>
                <h1 className="text-center">Unlock In</h1>
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                <button className="btn btn-primary px-3 btn-time fw-bolder text-center">
                  ---
                </button>
                <button className="btn btn-primary px-3 btn-time fw-bolder text-center">
                  ---
                </button>
                <button className="btn btn-primary px-3 btn-time fw-bolder text-center">
                  ---
                </button>
                <button className="btn btn-primary px-3 btn-time fw-bolder text-center">
                  ---
                </button>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col md="6">
                <h3>Pair Info</h3>
                {PairInfo.map((pair, i) => (
                  <Row className="list-container" key={i}>
                    <Col>{pair.label}</Col>
                    <Col className="text-end">
                      {pair.image && (
                        <img
                          className="pair-image"
                          src={pair.image}
                          alt="icon"
                        ></img>
                      )}{" "}
                      {pair.value}
                    </Col>
                  </Row>
                ))}
              </Col>
              <Col md="6">
                <h3>Lock Info</h3>
                {LockInfo.map((lock, i) => (
                  <Row className="list-container" key={i}>
                    <Col>{lock.label}</Col>
                    <Col className="text-end">{lock.value}</Col>
                  </Row>
                ))}
              </Col>
            </Row>
            <Row>
              <Col>
                <Row className="list-container">
                  <Col>Unlock Date</Col>
                  <Col className="text-end">
                    ---
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                <button
                  className="btn btn-primary px-3 fw-bolder text-center"
                  type="submit"
                >
                  Unlock
                </button>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  )
}

export default StaticLocker
