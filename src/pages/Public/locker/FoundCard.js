import React, { useState, useEffect } from "react"
import { MetaTags } from "react-meta-tags"

import { Col, Container, Form, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useTokenBalance } from "@usedapp/core"
import useTokenInfo from "hooks/useTokenInfo"

const FoundCard = ({
  liquidityAddress,
  unlockTime,
  tokenInfo,
  saleInfo,
  period,
}) => {
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
      label: "Total Amount Locked",
      value: "189.7542",
    },
    {
      label: "Total Value Locked",
      value: "$220.041",
    },
    {
      label: "Owner",
      value: "0xC8bA821FeD333e1c134324676643e41237583A245a",
    },
    {
      label: "Lock Date",
      value: "2022.08.26 21:07 UTC",
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
            <Row>
              <Col className="text-center">
                <button className="btn btn-primary px-3 btn-time fw-bolder text-center">
                  111
                </button>
                <button className="btn btn-primary px-3 btn-time fw-bolder text-center">
                  05
                </button>
                <button className="btn btn-primary px-3 btn-time fw-bolder text-center">
                  08
                </button>
                <button className="btn btn-primary px-3 btn-time fw-bolder text-center">
                  05
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
                    2023.02.26 20:07 UTC (in 4 months)
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

export default FoundCard
