import React, { useEffect, useState } from "react"
import moment from "moment/moment"

import { Button, Col, ProgressBar, Row, Placeholder } from "react-bootstrap"

import discordLogo from "assets/images/icons/discord.png"
import { Link, useHistory, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers/lib/utils"
import { BigNumber as BN } from "ethers"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import Countdown, { zeroPad } from "react-countdown"
import { updateSaleTime } from "store/actions"
import { CHAIN_NATIVE_SYMBOL } from "constants/Address"
import AuditInfo from "pages/Public/details/AuditInfo"

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
const SaleCard = ({ sale }) => {
  const currentDate = moment().unix()
  let history = useHistory()
  const dispatch = useDispatch()
  const users = useSelector(state => state.User)
  const [ready, setReady] = useState(true)
  const [tokenPriceOriginal, setTokenPriceOriginal] = useState()

  const handleClick = e => {
    if (e.target.id === "social" || e.target.id === "links") {
      void 0
    } else {
      history.push(`/sale/${sale.id}`)
    }
  }

  const saleInfo = sale?.info
  const tokenInfo = sale?.token

  const formattedRaised = saleInfo?.raisedBNB
    ? formatEther(saleInfo?.raisedBNB)
    : 0
  const percentSold = saleInfo?.hardCapBNB
    ? (formattedRaised * 100) / (formatEther(saleInfo?.hardCapBNB) * 1)
    : 0

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
              <h4 className="text-primary mb-0">{tokenInfo?.name}</h4>
              <h5>{tokenInfo?.symbol ? tokenInfo.symbol : "SPL"}</h5>
            </div>

            <div>
              <div className="avatar-md">
                <div className="avatar-title bg-primary bg-softer rounded-circle overflow-hidden fs-4">
                  <img
                    src={sale?.saleLinks?.logo}
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
          </div>

          <ul className="list-unstyled d-flex mb-4">
            <li className="ms-2">
              <a
                href={
                  sale.saleLinks.twitter
                    ? sale.saleLinks.twitter
                    : "https://twitter.com"
                }
                target="_blank"
              >
                <i id="social" className="bx bxl-twitter fs-3" />
              </a>
            </li>

            <li className="ms-2">
              <a
                href={
                  sale.saleLinks.discord
                    ? sale.saleLinks.discord
                    : "https://discord.com"
                }
                target="_blank"
              >
                <img id="social" src={discordLogo} alt="discord" />
              </a>
            </li>

            <li className="ms-2">
              <a
                href={
                  sale.saleLinks.telegram
                    ? sale.saleLinks.telegram
                    : "https://telegram.com"
                }
                target="_blank"
              >
                <i id="social" className="bx bxl-telegram fs-3" />
              </a>
            </li>
          </ul>

          {saleInfo?.saleStart > currentDate && (
            <span className="bg-primary text-dark fw-bold px-2 rounded-pill font-size-11 me-2">
              UPCOMING
            </span>
          )}
          {saleInfo?.saleStart < currentDate &&
          saleInfo?.saleEnd > currentDate ? (
            <span className="bg-primary text-dark fw-bold px-2 rounded-pill font-size-11 me-2">
              LIVE
            </span>
          ) : (
            <></>
          )}
          {saleInfo?.saleEnd < currentDate && (
            <span className="bg-primary text-dark fw-bold px-2 rounded-pill font-size-11 me-2">
              ENDED
            </span>
          )}
          {saleInfo?.isFinished && (
            <span className="bg-primary text-dark fw-bold px-2 rounded-pill font-size-11 me-2">
              CLOSED
            </span>
          )}

          <p className="my-2 text-white font-size-12 line-truncate-2">
            {sale.description}
          </p>

          <div className="text-white font-size-11">
            <Row className="mb-2">
              <Col xs={4}>Total Raise </Col>
              <Col xs={8} className="text-primary fs-6 text-end fw-bold">
                {formattedRaised} {CHAIN_NATIVE_SYMBOL}
              </Col>
            </Row>

            <Row className="mb-2">
              <Col xs={4}>Starts</Col>
              <Col xs={8} className="text-primary fs-6 text-end fw-bold">
                {saleInfo
                  ? dayjs
                      .utc(saleInfo.saleStart * 1000)
                      .format(DEFAULT_DATE_FORMAT)
                  : 0}
              </Col>
            </Row>

            <Row className="mb-2">
              <Col xs={4}>Price</Col>
              <Col xs={8} className="text-primary fs-6 text-end fw-bold">
                {saleInfo ? formatEther(saleInfo?.tokenPrice) : 0}{" "}
                {CHAIN_NATIVE_SYMBOL}
              </Col>
            </Row>
          </div>

          <div>
            <div className="mt-3 d-flex justify-content-between font-size-11">
              <Countdown
                date={dayjs.utc(saleInfo?.saleEnd * 1000)}
                renderer={renderer}
              ></Countdown>
              <span className="text-primary">{percentSold} %</span>
            </div>

            <ProgressBar className="mt-2" variant="primary" now={percentSold} />

            <Row className="mt-3 font-size-10">
              <Col xs={4}>1 {CHAIN_NATIVE_SYMBOL} (approx)</Col>
              <Col xs={8} className="text-end">
                Listing Time
              </Col>

              <Col xs={4} className="text-primary fs-6 fw-bold">
                {tokenPriceOriginal} {tokenInfo.symbol}
              </Col>
              <Col xs={8} className="text-primary text-end fs-6 fw-bold">
                {saleInfo
                  ? dayjs
                      .utc(saleInfo.saleEnd * 1000)
                      .format(DEFAULT_DATE_FORMAT)
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
