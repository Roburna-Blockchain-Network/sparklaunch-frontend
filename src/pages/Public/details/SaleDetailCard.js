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
import { BigNumber  } from "ethers"

import getUseSaleIsSuccess from "hooks/useSaleIsSuccess"
import getUseSaleFinished from "hooks/useSaleIsFinished"
import getUseSaleInfo from "hooks/useSaleInfo"
import { formatBigToNum, formatNumber, NativePrice } from "utils/helpers"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import RoundInfo from "./RoundInfo"
import AuditInfo from "./AuditInfo"
import { CHAIN_NATIVE_SYMBOL } from "constants/Address"
import TokenImage from "components/TokenImage"
dayjs.extend(utc)

const currentDate = dayjs.utc().unix()
const DEFAULT_DATE_FORMAT = "MMM DD, h:mm A"
const Completionist = () => <span>Sale Ended</span>
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
  const [getInfo, setGetInfo] = useState()
  const [BNBRaised, setBNBRaised] = useState(null)
  const [hardcap, setHardcap] = useState(null)
  const [totalSold, setTotalSold] = useState(null)

  const handleClick = e => {
    if (e.target.id === "social" || e.target.id === "links") {
      void 0
    }
  }

  const isFinish = sale.round.end < currentDate
  const isStart = sale.round.start < currentDate

  const timeCountDown = isStart
  ? dayjs.utc(sale.round.end * 1000).format()
  : dayjs.utc(sale.round.start * 1000).format();

  const rendererCountDown = isStart ? renderer : renderer2

  async function getSaleInfo () {
    const res = await getUseSaleInfo(sale.address)
    setGetInfo(res)
  }
  async function getBNBRaised() {
    if (!getInfo) return;
    const res = await getInfo.totalBNBRaised
    const temp = BigNumber.from(res.toString())
    setBNBRaised(temp)
  }
  async function getHardcap() {
    if (!getInfo) return;
    const res = await getInfo.hardCap
    const temp = BigNumber.from(res.toString())
    setHardcap(temp)
  }
  async function getTotalSold() {
    if (!getInfo) return;
    const res = await getInfo.totalTokensSold
    const temp = BigNumber.from(res.toString())
    setTotalSold(temp)
  }
  useEffect(() => {
    getBNBRaised()
    getHardcap()
    getTotalSold()
  }, [getInfo])

  useEffect(() => {
    getSaleInfo()
  }, [])

  useEffect(() => {
    if (BNBRaised===null||hardcap===null) {
      return
    }
    const percents = BNBRaised.mul(100).div(hardcap)
    const newRaised = formatBigToNum(BNBRaised.toString(), 18, 0)
    const newPercent = Number(percents.toString(), 0, 0)
    setRaised({
      ...raised,
      amount: newRaised,
      percent: newPercent,
    })
  }, [BNBRaised,hardcap])

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
              <TokenImage
                src={sale.saleLinks.logo}
                height="100%"
                width="100%"
                objectFit="contain"
                objectPosition="center"
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
          <div className="w-50 fw-bold">Total Raised </div>
          <div className="text-primary">
            :{" "}
            {BNBRaised!=null ? (
              <>
                {formatBigToNum(BNBRaised.toString(), 18, 0)}{" "}
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
            {totalSold!=null ? (
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
