import React, { useState, useEffect } from "react"
import { MetaTags } from "react-meta-tags"

import { Col, Container, Form, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"

//import methods to handle data
import { getDeploymentFee, deploySale } from "connect/dataProccessing"

const TokenLocker = () => {
  const PairInfo = [
    {
      label: "Quote Pair",
      image: "/images/tokens/bnb.svg",
      value: "WBNB",
    },
    {
      label: "Base Pair",
      image: "/images/tokens/sxp.svg",
      value: "SXP",
    },
    {
      label: "Symbol",
      value: "WBNB/SXP",
    },
    {
      label: "LP Supply",
      value: 9014470,
    },
    {
      label: "Dex Listed",
      value: "Spark",
    },
  ]
  const LockInfo = [
    {
      label: "Title",
      value: "Spark Lock",
    },
    {
      label: "Base Pair",
      value: "SXP",
    },
    {
      label: "Symbol",
      value: "WBNB/SXP",
    },
    {
      label: "LP Supply",
      value: "9,014,470",
    },
    {
      label: "Dex Listed",
      value: "Spark",
    },
  ]

  return (
    <>
      <div className="page-content">
        <MetaTags>
          <title>Project Setup | SparkLaunch</title>
        </MetaTags>
        <Container fluid>
          <div className="featured-card bg-dark p-4 my-2 rounded-4">
            <Row>
              <Col>
                <h1 className="text-center">Unlock In</h1>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col md="6">
                <h3>Pair Info</h3>
                {PairInfo.map((pair, i) => (
                  <Row className="list-container">
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
                  <Row className="list-container">
                    <Col>{lock.label}</Col>
                    <Col className="text-end">{lock.value}</Col>
                  </Row>
                ))}
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  )
}

export default TokenLocker
