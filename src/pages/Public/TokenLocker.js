import React, { useState, useEffect } from "react"
import { MetaTags } from "react-meta-tags"

import {
  Col,
  Container,
  Form,
  Card,
  Row,
  Spinner,
  Placeholder,
} from "react-bootstrap"
import { Link, Redirect, useHistory, useParams } from "react-router-dom"
import {
  API_URL,
  CHAIN_NUMBER,
  DEFAULT_DEX,
  WRAPPED_SYMBOL,
} from "constants/Address"
import { NotificationManager } from "react-notifications"
import { useEthers } from "@usedapp/core"
import usePairAddress from "hooks/usePairAddress"
import { getLockInfo, getSaleInfo, getTokenInfo } from "utils/factoryHelper"
import Countdown, { zeroPad } from "react-countdown"
import bscLogo from "assets/images/logos/rba.svg"
import useSaleIsSuccess from "hooks/useSaleIsSuccess"
import useLpWithdrawn from "hooks/useLpWithdrawn"
import useSaleInfo from "hooks/useSaleInfo"
import useLiquidityUnlockTime from "hooks/useLiquidityUnlockTime"
import useLiquidityLockPeriod from "hooks/useLiquidityLockPeriod"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(utc)
dayjs.extend(duration)
dayjs.extend(relativeTime)
const currentDate = dayjs.utc().unix()

const Completionist = () => (
  <div className="btn btn-primary px-3 btn-time fw-bolder text-center">
    You Can unlock Now !
  </div>
)
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />
  } else {
    // Render a countdown
    return (
      <>
        <div className="btn btn-primary px-3 btn-time fw-bolder text-center">
          {zeroPad(days)}
        </div>
        <div className="btn btn-primary px-3 btn-time fw-bolder text-center">
          {zeroPad(hours)}
        </div>
        <div className="btn btn-primary px-3 btn-time fw-bolder text-center">
          {zeroPad(minutes)}
        </div>
        <div className="btn btn-primary px-3 btn-time fw-bolder text-center">
          {zeroPad(seconds)}
        </div>
      </>
    )
  }
}

const TokenLocker = () => {
  const [saleInfo, setSaleInfo] = useState()
  const [lockDate, setLockDate] = useState(NaN)
  const [ready, setReady] = useState(false)
  const { account, library } = useEthers()
  const history = useHistory()

  const { address } = useParams()
  const isSaleSuccess = useSaleIsSuccess(address)
  const liquidityUnlockTime = useLiquidityUnlockTime(address)
  const liquidityLockPeriod = useLiquidityLockPeriod(address)
  const isLpWithdrawn = useLpWithdrawn(address)

  useEffect(async () => {
    const abortController = new AbortController()
    try {
      const response = await fetch(
        `${API_URL}lock/${CHAIN_NUMBER}/${address}`,
        {
          signal: abortController.signal,
        }
      )
      const res = await response.json()
      if (res.data.length > 0) {
        setSaleInfo({ fetchstatus: true, ...res.data[0] })
        setReady(true)
      } else {
        history.push("/token-locker-notfound")
      }
    } catch (error) {
      history.push("/token-locker-notfound")
    }

    return () => {
      abortController.abort()
    }
  }, [address])

  const getInfo = useSaleInfo(address)

  useEffect(() => {
    if (
      typeof liquidityUnlockTime == undefined ||
      typeof liquidityLockPeriod == undefined
    ) {
      return
    } else {
      setLockDate(liquidityUnlockTime - liquidityLockPeriod)
    }
  }, [liquidityUnlockTime, liquidityLockPeriod])
  console.log(lockDate)
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
                <h1 className="text-center">Unlock In</h1>
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                {liquidityUnlockTime ? (
                  <Countdown
                    date={dayjs.utc(dayjs.unix(liquidityUnlockTime))}
                    renderer={renderer}
                  ></Countdown>
                ) : (
                  <Countdown
                    date={(currentDate + 500000) * 1000}
                    renderer={renderer}
                  ></Countdown>
                )}
              </Col>
            </Row>
            <Row className="mt-5">
              <Col md="6">
                <h3>Pair Info</h3>
                <Row className="list-container">
                  <Col>Quote Pair</Col>
                  <Col className="text-end">
                    {ready ? (
                      <>
                        <img
                          className="pair-image"
                          src={bscLogo}
                          alt="icon"
                        ></img>{" "}
                        {WRAPPED_SYMBOL}
                      </>
                    ) : (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    )}
                  </Col>
                </Row>
                <Row className="list-container">
                  <Col>Base Pair</Col>
                  <Col className="text-end">
                    {ready ? (
                      <>
                        <img
                          className="pair-image"
                          src={saleInfo?.saleLinks?.logo}
                          alt="icon"
                        ></img>{" "}
                        {saleInfo?.token.symbol}
                      </>
                    ) : (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    )}
                  </Col>
                </Row>
                <Row className="list-container">
                  <Col>Symbol</Col>
                  <Col className="text-end">
                    {ready ? (
                      <>
                        {WRAPPED_SYMBOL} / {saleInfo?.token?.symbol}
                      </>
                    ) : (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    )}
                  </Col>
                </Row>
                <Row className="list-container">
                  <Col>LP Supply</Col>
                  <Col className="text-end">
                    {ready ? (
                      <>
                        {WRAPPED_SYMBOL} / {saleInfo?.token?.symbol}
                      </>
                    ) : (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    )}
                  </Col>
                </Row>
                <Row className="list-container">
                  <Col>DEX LISTED</Col>
                  <Col className="text-end">
                    {ready ? (
                      <>{DEFAULT_DEX}</>
                    ) : (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    )}
                  </Col>
                </Row>
              </Col>
              <Col md="6">
                <h3>Lock Info</h3>
                <Row className="list-container">
                  <Col>Title</Col>
                  <Col className="text-end">
                    {ready ? (
                      <> Spark Lock</>
                    ) : (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    )}
                  </Col>
                </Row>
                <Row className="list-container">
                  <Col>Total Amount Locked</Col>
                  <Col className="text-end">
                    {ready ? (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    ) : (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    )}
                  </Col>
                </Row>

                <Row className="list-container">
                  <Col>Total Value Locked</Col>
                  <Col className="text-end">
                    {ready ? (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    ) : (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    )}
                  </Col>
                </Row>

                <Row className="list-container">
                  <Col>Owner</Col>
                  <Col className="text-end">
                    {getInfo ? (
                      <> {getInfo?.saleOwner}</>
                    ) : (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    )}
                  </Col>
                </Row>
                <Row className="list-container">
                  <Col>Lock Date</Col>
                  <Col className="text-end">
                    {!isNaN(lockDate) ? (
                      <div>
                        {" "}
                        {dayjs
                          .utc(dayjs.unix(lockDate))
                          .format("YYYY.MM.DD HH:mm")}{" "}
                        UTC
                      </div>
                    ) : (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row className="list-container">
                  <Col>Unlock Date</Col>
                  <Col className="text-end">
                    {liquidityUnlockTime ? (
                      <>
                        {" "}
                        {dayjs
                          .utc(dayjs.unix(liquidityUnlockTime))
                          .format("YYYY.MM.DD HH:mm")}{" "}
                        (
                        {dayjs
                          .utc()
                          .to(dayjs.utc(dayjs.unix(liquidityUnlockTime)))
                          .toLocaleUpperCase()}
                        )
                      </>
                    ) : (
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    )}
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

export default TokenLocker
