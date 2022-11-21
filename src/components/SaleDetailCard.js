import React from "react"
import moment from "moment/moment"

import { Button, Col, ProgressBar, Row } from "react-bootstrap"
import Countdown, { zeroPad } from "react-countdown"

import discordLogo from "assets/images/icons/discord.png"
import { Link, useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import useTokenInfo from "hooks/useTokenInfo"
import { useEtherBalance } from "@usedapp/core"
import { formatEther, parseEther } from "ethers/lib/utils"
import { BigNumber as BN } from "ethers"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

const DEFAULT_DATE_FORMAT = "MMM DD, h:mm A"
const Completionist = () => <span>You are good to go!</span>
const renderer = ({ days, hours, minutes, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />
  } else {
    // Render a countdown
    return (
      <span>
        Sale Close in {zeroPad(days)} days, {zeroPad(hours)} Hours,{" "}
        {zeroPad(minutes)} Minutes
      </span>
    )
  }
}

const SaleDetailCard = ({ saleData, tokenInfo, saleInfo, roundInfo }) => {
  const currentDate = dayjs.utc().unix()
  let history = useHistory()

  const handleClick = e => {
    if (e.target.id === "social" || e.target.id === "links") {
      void 0
    }
  }
  const sale = saleData

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

      {/* <div className="text-white font-size-11">
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
      </div> */}

      <div>
        <div className="mt-3 d-flex justify-content-between font-size-11">
          <Countdown
            date={dayjs.utc(saleInfo.saleEnd * 1000)}
            renderer={renderer}
          ></Countdown>
          <span className="text-primary">45 %</span>
        </div>
        <ProgressBar className="mt-1" variant="primary" now={45} />

        <div className="d-flex w-100 flex-wrap mb-0 mt-3 py-1 border-bottom border-white border-opacity-50 text-center">
          <div className="w-100 fw-bold">Round Info</div>
        </div>

        <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-50 fw-bold">Round 1</div>
          <div className="text-primary">
            :{" "}
            {saleInfo.getCurrentRound == 1 && roundInfo.round1 > currentDate
              ? "On Going"
              : "Ended"}
          </div>
        </div>
        <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-50 fw-bold">Round 2</div>
          <div className="text-primary">
            :{" "}
            {saleInfo.getCurrentRound == 2 && roundInfo.round2 > currentDate
              ? "On Going"
              : "Ended"}
          </div>
        </div>

        <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-50 fw-bold">Round 3</div>
          <div className="text-primary">
            :{" "}
            {saleInfo.getCurrentRound == 3 && roundInfo.round3 > currentDate
              ? "On Going"
              : "Ended"}
          </div>
        </div>

        <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-50 fw-bold">Round 4</div>
          <div className="text-primary">
            :{" "}
            {saleInfo.getCurrentRound == 4 && roundInfo.round4 > currentDate
              ? "On Going"
              : "Ended"}
          </div>
        </div>

        <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-50 fw-bold">Round 5</div>
          <div className="text-primary">
            :{" "}
            {saleInfo.getCurrentRound == 5 &&
            roundInfo.round5 > currentDate &&
            currentDate < roundInfo.publicRound
              ? "On Going"
              : "Ended"}
          </div>
        </div>

        <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-50 fw-bold">Public Round</div>
          <div className="text-primary">
            :{" "}
            {saleInfo.getCurrentRound == 5 &&
            roundInfo.publicRound < currentDate &&
            currentDate < roundInfo.end
              ? "On Going"
              : "Ended"}
          </div>
        </div>

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
