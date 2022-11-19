import React from "react"
import moment from "moment/moment"

import { Button, Col, ProgressBar, Row } from "react-bootstrap"

import discordLogo from "assets/images/icons/discord.png"
import { Link, useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import useTokenInfo from "hooks/useTokenInfo"
import { useEtherBalance } from "@usedapp/core"
import { formatEther, parseEther } from "ethers/lib/utils"
import { BigNumber as BN } from "ethers"

const SaleDetailCard = ({ saleData, tokenInfo, saleInfo }) => {
  const currentDate = moment().unix()
  let history = useHistory()

  const handleClick = e => {
    if (e.target.id === "social" || e.target.id === "links") {
      void 0
    } else {
      history.push(`/sale/${sale.id}`)
    }
  }

  const sale = saleData

  const formattedRaised = 0
  // const formattedRaised = sale ? formatEther(sale.sale.totalBNBRaised) : 0

  return (
    <div
      onClick={handleClick}
      className="sale-detail-card"
      id="sale-card"
      style={{ cursor: "pointer" }}
    >
      <div className="d-flex flex-nowrap gap-3 align-items-center">
        <div className="m">
          <div className="avatar-md">
            <div className="avatar-title bg-primary bg-softer rounded-circle overflow-hidden fs-4">
              <img
                src={sale.saleLinks?.logo}
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  objectPosition: "10% 20%",
                }}
                alt={tokenInfo?.symbol ? tokenInfo?.symbol : "SPL"}
              />
            </div>
          </div>
        </div>
        <div className="flex-grow-1">
          <h4 className="text-primary mb-0">{tokenInfo.name}</h4>
          <h5>{tokenInfo?.symbol ? tokenInfo.symbol : "SPL"}</h5>
        </div>
      </div>

      <p className="my-2 text-white font-size-12 line-truncate-2">
        {sale.saleDetails.description}
      </p>

      <div className="text-white font-size-11">
        <Row className="mb-2">
          <Col xs={4}>Total Raise </Col>
          <Col xs={8} className="text-primary fs-6 text-end fw-bold">
            {formattedRaised} BNB
          </Col>
        </Row>

        <Row className="mb-2">
          <Col xs={4}>Starts</Col>
          <Col xs={8} className="text-primary fs-6 text-end fw-bold">
            {moment.unix(sale.saleParams.startDate).format("lll")}
          </Col>
        </Row>

        <Row className="mb-2">
          <Col xs={4}>Price</Col>
          <Col xs={8} className="text-primary fs-6 text-end fw-bold">
            {saleInfo ? formatEther(saleInfo.sale.tokenPriceInBNB) : 0} BNB
          </Col>
        </Row>
      </div>

      <div>
        <div className="mt-3 d-flex justify-content-between font-size-11">
          <span className="text-white">{sale.saleDetails.diff}</span>
          <span className="text-primary">{sale.saleDetails.percentage} %</span>
        </div>

        <ProgressBar variant="primary" now={sale.saleDetails.percentage} />

        <Row className="mt-3 font-size-10">
          <Col xs={6} className="text-center">
            <Button className="btn btn-kyc" href="#" id="links">
              {" "}
              AUDIT
            </Button>
          </Col>
          <Col xs={6} className="text-center">
            <Button className="btn btn-kyc" href="#" id="links">
              {" "}
              KYC
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default SaleDetailCard
