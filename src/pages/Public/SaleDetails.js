import React, { useEffect, useState } from "react"
import { MetaTags } from "react-meta-tags"

import { Col, Container, Form, Modal, Row, Spinner } from "react-bootstrap"
import moment from "moment/moment"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

import {
  depositTokens,
  finishSale,
  getSaleById,
  participateInsale,
  withdraw,
  withdrawDeposit,
  withdrawEarnings,
  withdrawUnused,
} from "connect/dataProccessing"

import smLogo from "assets/images/logos/smlogo.png"
import bscLogo from "assets/images/logos/bsc.png"
import discordLogo from "assets/images/icons/discord.png"
import { useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom"
import { ChainId, useConfig, useEthers } from "@usedapp/core"
import { formatEther, formatUnits, parseUnits } from "ethers/lib/utils"
import SaleDetailCard from "components/SaleDetailCard"
import { API_URL, CHAIN_NUMBER } from "constants/Address"
import { getRoundInfo, getSaleInfo, getTokenInfo } from "utils/factoryHelper"
import { formatBigNumber } from "utils/numbers"
import BuyDetailCard from "components/BuyDetailCard"
import { BigNumber } from "ethers"
import AdminDetailCard from "./details/AdminDetailCard"
dayjs.extend(utc)

const DEFAULT_DATE_FORMAT = "MMM DD, h:mm A"
const currentDate = dayjs.utc()
const SaleDetails = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [init, setInit] = useState(true)
  const [saleData, setSaleData] = useState()
  const [tokenInfo, setTokenInfo] = useState()
  const [saleInfo, setSaleInfo] = useState()
  const [roundInfo, setRoundInfo] = useState()
  const [tokenPriceOriginal, setTokenPriceOriginal] = useState()
  const history = useHistory()
  const { sales } = useSelector(state => state.Sales)
  const { id } = useParams()

  const { account } = useEthers()

  useEffect(async () => {
    const abortController = new AbortController()
    try {
      const response = await fetch(
        `${API_URL}sale/chain/${CHAIN_NUMBER}/id/${id}`,
        { signal: abortController.signal }
      )

      const res = await response.json()
      if (res.data.length == 0) {
        alert(`sale not found`)
        history.push("/")
      }

      setSaleData(res.data[0])

      const token = await getTokenInfo(res.data[0].tokenAddress)

      // console.log(res.data[0].address)

      const sales = await getSaleInfo(res.data[0].address)

      // console.log(sales)
      const round = await getRoundInfo(res.data[0].address)
      if (round.success) {
        setRoundInfo(round.data)
      }

      // console.log(round)
      if (token.success) {
        setTokenInfo(token.data)
      }

      if (sales.success) {
        const tokenDec = parseUnits("1", tokenInfo?.decimals)

        const tokenPrice = tokenDec.div(sales.data.tokenPriceBNB).toString()
        setTokenPriceOriginal(tokenPrice)
        setSaleInfo(sales.data)
      }
    } catch (error) {
      console.log(error)
    }

    console.log(saleInfo)
    setReady(true)

    return () => {
      abortController.abort()
    }
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Sale Parcticipation | SparkLaunch</title>
        </MetaTags>

        <Container fluid>
          {!ready ? (
            <div className="text-center">
              <img src={smLogo} className="blinking-item" />
            </div>
          ) : (
            <Row className="mx-0 justify-content-center">
              <Col
                md={8}
                className="bg-dark bg-softer border border-primary rounded-4 p-3 mb-4 mb-lg-0"
              >
                <div className="d-flex flex-nowrap align-items-center">
                  <div>
                    <div className="avatar-md me-3">
                      <div className="avatar-title bg-primary bg-softer border border-primary rounded-circle overflow-hidden">
                        <img
                          src={saleData?.saleLinks?.logo}
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
                    <h3 className="text-primary mb-0 me-2 fw-bold">
                      {saleData?.saleToken?.name}
                    </h3>
                    <h5>{saleData?.saleToken?.symbol}</h5>
                  </div>

                  <div>
                    <div className="avatar-md me-3">
                      <div className="avatar-title bg-dark bg-soft rounded-circle overflow-hidden">
                        <img
                          src={bscLogo}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            objectPosition: "10% 20%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="my-3 text-white font-size-12 line-truncate-2">
                  {saleData?.description}
                </p>

                <ul className="list-unstyled d-flex my-4">
                  <li className="ms-2">
                    <a
                      href={
                        saleData?.saleLinks.twitter
                          ? saleData?.saleLinks.twitter
                          : "#"
                      }
                    >
                      <i className="bx bxl-twitter fs-3" />
                    </a>
                  </li>

                  <li className="ms-2">
                    <a
                      href={
                        saleData?.saleLinks.discord
                          ? saleData?.saleLinks.discord
                          : "#"
                      }
                    >
                      <img src={discordLogo} alt="discord" />
                    </a>
                  </li>

                  <li className="ms-2">
                    <a
                      href={
                        saleData?.saleLinks.telegram
                          ? saleData?.saleLinks.telegram
                          : "#"
                      }
                    >
                      <i className="bx bxl-telegram fs-3" />
                    </a>
                  </li>
                </ul>

                <div className="text-white font-size-14 mb-4">
                  <h5 className="text-primary">POOL DETAILS</h5>

                  <Row>
                    <Col>
                      <p>
                        <span className="fw-bold">Access Type : </span>
                        {saleInfo?.isPublic ? "Public" : "Private"}
                      </p>
                    </Col>
                    <Col>
                      <p>
                        <span className="fw-bold">Hard Cap : </span>
                        {saleInfo
                          ? formatUnits(saleInfo.hardCap, tokenInfo.decimals)
                          : 0}{" "}
                        BNB
                      </p>
                    </Col>
                  </Row>

                  <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
                    <div className="w-25 fw-bold">Presale Rate</div>
                    <div className="text-primary">
                      : 1 BNB : {tokenPriceOriginal} {tokenInfo.symbol}
                    </div>
                  </div>

                  <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
                    <div className="w-25 fw-bold">Dex Swap Rate</div>
                    <div className="text-primary">
                      : 1 BNB :{" "}
                      {formatUnits(
                        BigNumber.from(saleInfo.listingRate),
                        tokenInfo.decimals
                      ) * 1}{" "}
                      {tokenInfo.symbol}
                    </div>
                  </div>

                  <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
                    <div className="w-25 fw-bold">Start / End</div>
                    <div className="text-primary">
                      :{" "}
                      {dayjs
                        .utc(saleInfo.saleStart * 1000)
                        .format(DEFAULT_DATE_FORMAT)}{" "}
                      -{" "}
                      {dayjs
                        .utc(saleInfo.saleEnd * 1000)
                        .format(DEFAULT_DATE_FORMAT)}
                    </div>
                  </div>

                  <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
                    <div className="w-25 fw-bold">Base Allocation</div>
                    <div className="text-primary">
                      : {formatUnits(saleInfo.softCap, tokenInfo.decimals)} -{" "}
                      {formatUnits(saleInfo.hardCap, tokenInfo.decimals)}{" "}
                      {tokenInfo.symbol}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <Col md={7}>
                    <div className="text-white font-size-14 mb-4">
                      <h5 className="text-primary">Token Info</h5>
                      <div className="d-flex w-100 flex-wrap mb-0 py-1">
                        <div className="w-25 fw-bold">Name</div>
                        <div className="text-primary">: {tokenInfo?.name}</div>
                      </div>
                      <div className="d-flex w-100 flex-wrap mb-0 py-1">
                        <div className="w-25 fw-bold">Symbols</div>
                        <div className="text-primary">
                          : {tokenInfo?.symbol}
                        </div>
                      </div>
                      <div className="d-flex w-100 flex-wrap mb-0 py-1">
                        <div className="w-25 fw-bold">Decimals</div>
                        <div className="text-primary">
                          : {tokenInfo?.decimals}
                        </div>
                      </div>
                      <div className="d-flex w-100 flex-wrap mb-0 py-1">
                        <div className="w-25 fw-bold">Supply</div>
                        <div className="text-primary">
                          :{" "}
                          {tokenInfo
                            ? formatBigNumber(
                                tokenInfo.totalSupply,
                                tokenInfo.decimals
                              )
                            : 0}
                        </div>
                      </div>
                      <div className="d-flex w-100 flex-wrap mb-0 py-1">
                        <div className="w-25 fw-bold">Type</div>
                        <div className="text-primary">: BEP20 / ERC20</div>
                      </div>
                    </div>
                  </Col>
                </div>
              </Col>

              <Col md={4}>
                <SaleDetailCard
                  saleData={saleData}
                  tokenInfo={tokenInfo}
                  saleInfo={saleInfo}
                  roundInfo={roundInfo}
                />

                <BuyDetailCard
                  saleData={saleData}
                  tokenInfo={tokenInfo}
                  saleInfo={saleInfo}
                  roundInfo={roundInfo}
                />
                <AdminDetailCard
                  saleData={saleData}
                  tokenInfo={tokenInfo}
                  saleInfo={saleInfo}
                  roundInfo={roundInfo}
                />
              </Col>
            </Row>
          )}

          {/* <Modal
            backdrop="static"
            size="sm"
            show={showParticipateModal}
            centered
            onHide={() => setShowParticipateModal(false)}
          >
            <div className="modal-content">
              <Modal.Header>
                <span className="text-primary fs-4">Buy Tokens</span>
                <button
                  className="btn border-0"
                  data-bs-dismiss="modal"
                  onClick={() => setShowParticipateModal(false)}
                >
                  X
                </button>
              </Modal.Header>
              <Form onSubmit={handleParticipate} className="m-3">
                <Form.Group className="mb-3" controlId="amount">
                  <Form.Label>Amount </Form.Label>
                  <Form.Text className="text-white">
                    {" "}
                    (Max: {saleData?.saleParams.maxBuy} BNB)
                  </Form.Text>
                  <Form.Control
                    placeholder="0"
                    type="number"
                    step="0.00001"
                    min="0"
                  />
                </Form.Group>

                <div className="text-center">
                  <button
                    className="btn btn-primary px-3 fw-bolder w-50 text-nowrap"
                    type="submit"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        Processing...
                      </>
                    ) : (
                      "Buy"
                    )}
                  </button>
                </div>
              </Form>
              <Modal.Body></Modal.Body>
            </div>
          </Modal> */}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default SaleDetails
