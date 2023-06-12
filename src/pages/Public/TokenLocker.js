import React, { useState, useEffect } from "react"
import { MetaTags } from "react-meta-tags"

import {
  Col,
  Container,
  Form,
  Modal,
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
import {
  getLockInfo,
  getLpLockInfo,
  getSaleInfo,
  getTokenInfo,
} from "utils/factoryHelper"
import Countdown, { zeroPad } from "react-countdown"
import bscLogo from "assets/images/logos/bsc.png"
import getUseSaleIsSuccess from "hooks/useSaleIsSuccess"
import useLpWithdrawn from "hooks/useLpWithdrawn"
import getUseSaleInfo from "hooks/useSaleInfo"
import useLiquidityUnlockTime from "hooks/useLiquidityUnlockTime"
import useLiquidityLockPeriod from "hooks/useLiquidityLockPeriod"
import { Contract } from "@ethersproject/contracts"
import SaleAbi from "constants/abi/Sale.json"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
import { formatBigToNum } from "utils/helpers"
dayjs.extend(utc)
dayjs.extend(duration)
dayjs.extend(relativeTime)
const currentDate = dayjs.utc().unix()

const Completionist = () => (
  <div className="btn btn-primary px-3 btn-time fw-bolder text-center">
    LP Token Can Unlock Now !
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
  const [lpInfo, setLpInfo] = useState()
  const [lockDate, setLockDate] = useState(NaN)
  const [ready, setReady] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
  const { account, library } = useEthers()
  const history = useHistory()

  const { address } = useParams()
  const isSaleSuccess = getUseSaleIsSuccess(address)
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

  useEffect(async () => {
    try {
      const response = await getLpLockInfo(address)
      console.log(response)
      if (response.success) {
        setLpInfo(response.data)
      }
    } catch (error) {}
  }, [address])

  const handleUnlock = async e => {
    setShowModal2(true)

    const saleContractAddress = saleInfo.address
    const contract = new Contract(
      saleContractAddress,
      SaleAbi,
      library.getSigner()
    )

    try {
      const tx = await contract.withdrawLP()
      await tx.wait()
      NotificationManager.success(`Unlock Completed`, "Thanks", 3000)
      setTimeout(() => {
        window.location.reload()
      }, 4000)
      return
    } catch (error) {
      NotificationManager.error(`There error on Unlock LP-Token`, "Sorry")
    }

    setTimeout(() => {
      setShowModal2(false)
    }, 2000)
  }

  const getInfo = getSaleInfo(address)

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
                    {lpInfo ? (
                      <>{formatBigToNum(lpInfo?.totalSupply, 18, 2)} </>
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
                    {lpInfo ? (
                      <>{formatBigToNum(lpInfo?.totalLock, 18, 2)} </>
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
                      <>N/A</>
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
              {account && getInfo?.saleOwner == account ? (
                <Col className="text-center">
                  <button
                    className="btn btn-primary px-3 fw-bolder text-center"
                    type="submit"
                    onClick={handleUnlock}
                    disabled={isLpWithdrawn}
                  >
                    {isLpWithdrawn ? "Already Unlocked" : "Unlock"}
                  </button>
                </Col>
              ) : null}
            </Row>
          </div>
        </Container>
      </div>
      <Modal
        backdrop="static"
        size="sm"
        show={showModal2}
        centered
        onHide={() => setShowModal2(false)}
      >
        <div className="modal-content">
          <Modal.Header>
            <span className="text-primary fs-4">Processing...</span>
          </Modal.Header>
          <div className="p-4">
            <div className="text-center">
              <div className="mb-3 fs-4">Please wait .....</div>
              <Spinner animation="border" />
            </div>
          </div>
          <Modal.Body></Modal.Body>
        </div>
      </Modal>
    </>
  )
}

export default TokenLocker
