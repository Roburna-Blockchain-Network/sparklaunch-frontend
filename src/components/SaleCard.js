import React, { useEffect, useState } from "react"
import moment from "moment/moment"

import {
  Button,
  Col,
  Card,
  ProgressBar,
  Row,
  Placeholder,
} from "react-bootstrap"

import discordLogo from "assets/images/icons/discord.png"
import { Link, useHistory, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers/lib/utils"
import { BigNumber } from "ethers"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import Countdown, { zeroPad } from "react-countdown"
import { CHAIN_NATIVE_SYMBOL } from "constants/Address"
import AuditInfo from "pages/Public/details/AuditInfo"
import getUseSaleIsSuccess from "hooks/useSaleIsSuccess"
import getUseSaleFinished from "hooks/useSaleIsFinished"
import getUseSaleInfo from "hooks/useSaleInfo"
import { formatBigToNum, formatNumber, NativePrice } from "utils/helpers"
import SocialLinks from "pages/Public/home/SocialLinks"
import TokenImage from "./TokenImage"

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
    // Render a completed state
    return <Completionist2 />
  } else {
    // Render a countdown
    return (
      <span>
        Sale start in {zeroPad(days)} days, {zeroPad(hours)} Hours,{" "}
        {zeroPad(minutes)} Minutes
      </span>
    )
  }
}

const SaleCard = ({ sale }) => {
  const currentDate = moment().unix()
  let history = useHistory()
  const [ready, setReady] = useState(true)
  const [getInfo, setGetInfo] = useState()
  const [BNBRaised, setBNBRaised] = useState(null)
  const [hardcap, setHardcap] = useState(null)
  const [raised, setRaised] = useState({
    amount: "0",
    percent: "0",
  })
  const [isClosed, setIsClosed] = useState(false)

  const handleClick = e => {
    if (e.target.id === "social" || e.target.id === "links") {
      void 0
    } else {
      history.push(`/sale/${sale.id}`)
    }
  }

  const saleInfo = sale?.info
  const tokenInfo = sale?.token

  const isFinish = sale.round.end < currentDate
  const isStart = sale.round.start < currentDate

  const isSuccess = getUseSaleIsSuccess(sale.address)

  async function getFinished() {
    const res = await getUseSaleFinished(sale.address);
    setIsClosed(res);
  }
  
  async function getSaleInfo() {
    const res = await getUseSaleInfo(sale.address);
    setGetInfo(res);
  }
  

  useEffect(() => {
    getFinished()
    getSaleInfo()
  }, [])

  const timeCountDown = isStart
    ? dayjs.utc(sale.round.end * 1000).format()
    : dayjs.utc(sale.round.start * 1000).format();
    
  const rendererCountDown = isStart ? renderer : renderer2

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
  useEffect(() => {
    getBNBRaised()
    getHardcap()
  }, [getInfo])

  useEffect(() => {
    if (BNBRaised===null||hardcap===null) {
      return
    }
    const percents = BNBRaised.mul(100).div(hardcap)
    const newRaised = formatBigToNum(BNBRaised.toString(), 18, 0)
    const newPercent = Number(percents.toString(), 0, 0)
    console.log(
      `raised : `,
      BNBRaised.toString(),
      `hardcap`,
      hardcap.toString(),
      `percent`,
      percents.toString()
    )
    setRaised({
      ...raised,
      amount: newRaised,
      percent: newPercent,
    })
  }, [BNBRaised,hardcap])

  useEffect(() => {
    const intervalId = setInterval(() => {
      window.location.reload();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <>
      {ready ? (
        <div
          onClick={handleClick}
          className="sale-card"
          id="sale-card"
          style={{
            cursor: "pointer",
          }}
        >
          <div className="d-flex flex-nowrap">
            <div className="flex-grow-1">
              <h4 className="text-primary mb-0">{sale.name}</h4>
              <h5>{tokenInfo?.name ? tokenInfo.name : "SPL"}</h5>
            </div>
            <div>
              
              <div className="avatar-md">
                <div className="avatar-title bg-primary bg-softer rounded-circle overflow-hidden fs-4">
                  <TokenImage
                    src={sale?.saleLinks?.logo}
                    height="100%"
                    width="100%"
                    objectFit="contain"
                    objectPosition="center"
                    alt={tokenInfo?.symbol ? tokenInfo?.symbol : "SPL"}
                  />
                </div>
              </div>
            </div>
          </div>

          <ul className="list-unstyled d-flex mb-4">

            <SocialLinks links={sale.saleLinks} />
          </ul>

          {sale.round.start > currentDate && (
            <span className="bg-primary text-dark fw-bold px-2 rounded-pill font-size-11 me-2">
              UPCOMING
            </span>
          )}
          {sale.round.start < currentDate && sale.round.end > currentDate ? (
            <span className="bg-primary text-dark fw-bold px-2 rounded-pill font-size-11 me-2">
              LIVE
            </span>
          ) : (
            <></>
          )}
          {sale.round.end < currentDate && (
            <span className="bg-primary text-dark fw-bold px-2 rounded-pill font-size-11 me-2">
              ENDED
            </span>
          )}
          {isClosed && (
            <span className="bg-primary text-dark fw-bold px-2 rounded-pill font-size-11 me-2">
              CLOSED
            </span>
          )}

          <p className="my-2 text-white font-size-12 line-truncate-2">
            {sale.description}
          </p>

          <div className="text-white font-size-11">
            <Row className="mb-2">
              <Col xs={4}>Soft Cap </Col>
              <Col xs={8} className="text-primary fs-6 text-end fw-bold">
                {formatBigToNum(sale.info.softcap, 18, 2)} {CHAIN_NATIVE_SYMBOL}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={4}>Hard Cap </Col>
              <Col xs={8} className="text-primary fs-6 text-end fw-bold">
                {formatBigToNum(sale.info.hardcap, 18, 2)} {CHAIN_NATIVE_SYMBOL}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={4}>Total Raised </Col>
              <Col xs={8} className="text-primary fs-6 text-end fw-bold">
                {BNBRaised? (
                  <>
                    {formatBigToNum(BNBRaised.toString(), 18, 4)}{" "}
                    {CHAIN_NATIVE_SYMBOL}
                  </>
                ) : (
                  <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                )}
              </Col>
            </Row>

            <Row className="mb-2">
              <Col xs={4}>Starts</Col>
              <Col xs={8} className="text-primary fs-6 text-end fw-bold">
                {sale
                  ? dayjs
                      .utc(sale.round.start * 1000)
                      .format(DEFAULT_DATE_FORMAT)
                  : 0}
              </Col>
            </Row>

            <Row className="mb-2">
              <Col xs={4}>Price</Col>
              <Col xs={8} className="text-primary fs-6 text-end fw-bold">
                {saleInfo
                  ? formatNumber(
                      NativePrice(saleInfo.saleRate, tokenInfo.decimals)
                    )
                  : 0}{" "}
                {CHAIN_NATIVE_SYMBOL}
              </Col>
            </Row>
          </div>

          <div>
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

            <ProgressBar
              className="mt-2"
              variant="primary"
              now={raised.percent}
            />

            <Row className="mt-3 font-size-10">
              <Col xs={4}>1 {CHAIN_NATIVE_SYMBOL} (approx)</Col>
              <Col xs={8} className="text-end">
                Listing Time
              </Col>

              <Col xs={4} className="text-primary fs-6 fw-bold">
                {formatBigToNum(sale.info.saleRate, sale.token.decimals, 0)}{" "}
                {tokenInfo.symbol}
              </Col>
              <Col xs={8} className="text-primary text-end fs-6 fw-bold">
                {saleInfo
                  ? dayjs.utc(sale.round.end * 1000).format(DEFAULT_DATE_FORMAT)
                  : 0}
              </Col>
            </Row>
            <AuditInfo kyc={sale?.kyc} audit={sale?.audit} />
          </div>
        </div>
      ) : (
        <>
          <div className="sale-card-animation" id="sale-card"></div>
        </>
      )}
    </>
  )
}

export default SaleCard
