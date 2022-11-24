import React from "react"
import moment from "moment/moment"

import { Button, Col, ProgressBar, Row } from "react-bootstrap"
import Countdown, { zeroPad } from "react-countdown"

import discordLogo from "assets/images/icons/discord.png"
import { Link, useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import useTokenInfo from "hooks/useTokenInfo"
import { useEtherBalance } from "@usedapp/core"
import { formatEther, parseEther, formatUnits } from "ethers/lib/utils"
import { BigNumber as BN } from "ethers"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import RoundInfo from "./RoundInfo"
import AuditInfo from "./AuditInfo"
import { CHAIN_NATIVE_SYMBOL } from "constants/Address"
dayjs.extend(utc)

const DEFAULT_DATE_FORMAT = "MMM DD, h:mm A"
const Completionist = () => <span>Sale is End</span>
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

  const handleClick = e => {
    if (e.target.id === "social" || e.target.id === "links") {
      void 0
    }
  }
  const sale = saleData
  const formattedRaised = saleInfo ? formatEther(saleInfo?.raisedBNB) : 0
  const formattedSold = saleInfo
    ? formatUnits(saleInfo?.soldToken, tokenInfo.decimals)
    : 0
  const percentSold =
    (formattedRaised * 100) / (formatEther(saleInfo.hardCapBNB) * 1)

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

      <div>
        <div className="d-flex w-100 flex-wrap mt-3 mb-0 py-1 border-bottom border-white border-opacity-50"></div>
        <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-50 fw-bold">Total Raised</div>
          <div className="text-primary">
            : {formattedRaised} {CHAIN_NATIVE_SYMBOL}
          </div>
        </div>
        <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-50 fw-bold">Token Sold</div>
          <div className="text-primary">
            : {formattedSold} {tokenInfo.symbol}
          </div>
        </div>
        <div className="mt-3 d-flex justify-content-between font-size-11">
          <Countdown
            date={dayjs.utc(saleInfo.saleEnd * 1000)}
            renderer={renderer}
          ></Countdown>
          <span className="text-primary">{percentSold} %</span>
        </div>
        <ProgressBar className="mt-1" variant="primary" now={percentSold} />

        <RoundInfo saleInfo={saleInfo} roundInfo={roundInfo} />
        <AuditInfo audit={saleData.audit} kyc={saleData.kyc} />
      </div>
    </div>
  )
}

export default SaleDetailCard
