import React, { useState, useEffect } from "react"
import { MetaTags } from "react-meta-tags"

import { Col, Container, Form, Row, Spinner } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { API_URL, CHAIN_NUMBER } from "constants/Address"
import getUseSaleFinished from "hooks/useSaleIsFinished"
import getUseSaleIsSuccess from "hooks/useSaleIsSuccess"
import { NotificationManager } from "react-notifications"
import getUseSaleInfo from "hooks/useSaleInfo"
import { useEthers } from "@usedapp/core"
import useTokenInfo from "hooks/useTokenInfo"
import useLiquidityLockPeriod from "hooks/useLiquidityLockPeriod"
import useLiquidityUnlockTime from "hooks/useLiquidityUnlockTime"
import usePairAddress from "hooks/usePairAddress"

const LockerNotFound = () => {
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
          <title>Liquidity Lock Info | Sparklaunch</title>
        </MetaTags>
        <Container fluid>
          <div className="featured-card bg-dark p-4 my-2 rounded-4">
            <Row>
              <Col>
                <h1 className="text-center">Sorry Lock Address Not Found</h1>
              </Col>
            </Row>

            <Row>
              <Col className="text-center">
                <Link
                  to="/"
                  className="btn btn-primary px-3 fw-bolder text-center"
                >
                  Back To Home
                </Link>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  )
}

export default LockerNotFound
