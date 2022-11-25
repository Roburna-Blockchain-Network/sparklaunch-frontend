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
import useSaleIsSuccess from "hooks/useSaleIsSuccess"
import { NotificationManager } from "react-notifications"
import { useEthers } from "@usedapp/core"
import usePairAddress from "hooks/usePairAddress"
import { getLockInfo, getSaleInfo, getTokenInfo } from "utils/factoryHelper"
import Countdown, { zeroPad } from "react-countdown"
import bscLogo from "assets/images/logos/rba.svg"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
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
  const [ready, setReady] = useState(false)
  const { account, library } = useEthers()
  const history = useHistory()

  const { address } = useParams()

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
        const token = await getTokenInfo(res.data[0].tokenAddress)
        const sale = await getLockInfo(res.data[0].address)
        console.log(sale)
        if (token.success && sale.success) {
          res.data[0].tokenInfo = token.data
          res.data[0].lockInfo = sale.data
          setSaleInfo({ fetchstatus: true, ...res.data[0] })
          setReady(true)
        } else {
          // history.push("/token-locker-notfound")
        }
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

  console.log(saleInfo)

  // todo revert is sale success
  return (
    <>
      {!saleInfo?.lockInfo.isSuccess && !saleInfo?.lockInfo.lpWithdrawn ? (
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
                  <Countdown
                    date={(currentDate + 500000) * 1000}
                    renderer={renderer}
                  ></Countdown>
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
                          {saleInfo?.tokenInfo?.symbol}
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
                          {WRAPPED_SYMBOL} / {saleInfo?.tokenInfo?.symbol}
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
                          {WRAPPED_SYMBOL} / {saleInfo?.tokenInfo?.symbol}
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
                        <> Spark Lock</>
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
                        <> $220.041</>
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
                      {ready ? (
                        <> {saleInfo?.lockInfo?.saleOwner}</>
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
                      {ready ? (
                        <> {saleInfo?.lockInfo?.lockDate}</>
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
                      {ready ? (
                        <> 2023.02.26 20:07 UTC (in 4 months)</>
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
      ) : (
        <Redirect to="/token-locker-notfound" />
      )}

      {/*  */}
    </>
  )
}

export default TokenLocker
