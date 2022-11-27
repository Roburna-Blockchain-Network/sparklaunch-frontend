import React, { useEffect, useState } from "react"
import moment from "moment/moment"

import {
  Button,
  Col,
  ProgressBar,
  Row,
  Card,
  Placeholder,
} from "react-bootstrap"
import Countdown, { zeroPad } from "react-countdown"

import discordLogo from "assets/images/icons/discord.png"
import { Link, useHistory } from "react-router-dom"
import { formatEther, parseEther, formatUnits } from "ethers/lib/utils"
import { BigNumber as BN } from "ethers"

import useSaleIsSuccess from "hooks/useSaleIsSuccess"
import useSaleFinished from "hooks/useSaleIsFinished"
import useSaleInfo from "hooks/useSaleInfo"
import { formatBigToNum, formatNumber, NativePrice } from "utils/helpers"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import RoundInfo from "./RoundInfo"
import AuditInfo from "./AuditInfo"
import { CHAIN_NATIVE_SYMBOL } from "constants/Address"
dayjs.extend(utc)

const currentDate = dayjs.utc().unix()
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

const Completionist2 = () => <span>Sale is start now</span>
const renderer2 = ({ days, hours, minutes, completed }) => {
  if (completed) {
    return <Completionist2 />
  } else {
    return (
      <span>
        Sale start in {zeroPad(days)} days, {zeroPad(hours)} Hours,{" "}
        {zeroPad(minutes)} Minutes
      </span>
    )
  }
}

const SaleDetailCard = ({ sale }) => {
  const currentDate = dayjs.utc().unix()

  const [raised, setRaised] = useState({
    amount: "0",
    percent: "0",
  })

  const handleClick = e => {
    if (e.target.id === "social" || e.target.id === "links") {
      void 0
    }
  }

  const isFinish = sale.round.end < currentDate
  const isStart = sale.round.start < currentDate

  const timeCountDown = isStart
    ? dayjs.utc(sale.round.end * 1000)
    : dayjs.utc(sale.round.start * 1000)

  const rendererCountDown = isStart ? renderer : renderer2
  const getInfo = useSaleInfo(sale.address)
  useEffect(() => {
    if (typeof getInfo == "undefined") {
      return
    }

    const percents = getInfo.totalBNBRaised.mul(100).div(getInfo.hardCap)
    const newRaised = formatBigToNum(getInfo.totalBNBRaised.toString(), 18, 0)
    const newPercent = formatBigToNum(percents.toString(), 0, 0)

    setRaised({
      amount: newRaised,
      percent: newPercent,
    })
  }, [getInfo])

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
                src={sale.saleLinks.logo}
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  objectPosition: "10% 20%",
                }}
                alt={sale.token?.symbol}
              />
            </div>
          </div>
        </div>
        <div className="flex-grow-1">
          <h4 className="text-primary mb-0">{sale.token.name}</h4>
          <h5>{sale.token.symbol}</h5>
        </div>
      </div>

      <div>
        <div className="d-flex w-100 flex-wrap mt-3 mb-0 py-1 border-bottom border-white border-opacity-50"></div>
        <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-50 fw-bold">Total Raised</div>
          <div className="text-primary">
            :{" "}
            {getInfo ? (
              <>
                {formatBigToNum(getInfo.totalBNBRaised.toString(), 18, 0)}{" "}
                {CHAIN_NATIVE_SYMBOL}
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-50 fw-bold">Token Sold</div>
          <div className="text-primary">
            :{" "}
            {getInfo ? (
              <>
                {formatBigToNum(
                  getInfo.totalTokensSold.toString(),
                  sale.token.decimals,
                  0
                )}{" "}
                {sale.token.symbol}
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="mt-3 d-flex justify-content-between font-size-11">
          {isFinish ? (
            <>Sale is Finished</>
          ) : (
            <Countdown
              date={timeCountDown}
              renderer={rendererCountDown}
            ></Countdown>
          )}

          <span className="text-primary">{raised.percent} %</span>
        </div>
        <ProgressBar className="mt-1" variant="primary" now={raised.percent} />

        <RoundInfo sale={sale} />
        <AuditInfo audit={sale.audit} kyc={sale.kyc} />
      </div>
    </div>
  )
}

export default SaleDetailCard
