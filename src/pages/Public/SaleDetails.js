import React, { useEffect, useState } from "react"
import { MetaTags } from "react-meta-tags"

import { Col, Container, Form, Modal, Row, Spinner } from "react-bootstrap"
import moment from "moment/moment"

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
import useTokenInfo from "hooks/useTokenInfo"
import useSaleInfo from "hooks/useSaleInfo"
import { formatEther, formatUnits } from "ethers/lib/utils"
import SaleDetailCard from "components/SaleDetailCard"
import { API_URL } from "constants/Address"
import { getSaleInfo, getTokenInfo } from "utils/factoryHelper"
import { formatBigNumber } from "utils/numbers"
import BuyDetailCard from "components/BuyDetailCard"

const SaleDetails = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [init, setInit] = useState(true)
  const [saleData, setSaleData] = useState()
  const [tokenInfo, setTokenInfo] = useState()
  const [saleInfo, setSaleInfo] = useState()

  const { sales } = useSelector(state => state.Sales)
  const { selectedChain } = useSelector(state => state.User)
  const { id } = useParams()

  useEffect(async () => {
    const abortController = new AbortController()
    try {
      const response = await fetch(
        `${API_URL}sale/chain/${selectedChain}/id/${id}`,
        { signal: abortController.signal }
      )
      const res = await response.json()
      setSaleData(res.data[0])

      const token = await getTokenInfo(
        selectedChain,
        res.data[0].saleToken.address
      )

      // console.log(res.data[0].address)

      const sales = await getSaleInfo(selectedChain, res.data[0].address)
      // console.log(sales)

      if (token.success) {
        setTokenInfo(token.data)
      }
      if (sales.success) {
        setSaleInfo(sales.data)
      }
    } catch (error) {
      console.log(error)
    }
    // console.log(saleInfo)
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
                          alt={
                            saleData?.saleToken.symbol
                              ? saleData?.saleToken.symbol
                              : "SPL"
                          }
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
                  {saleData?.saleDetails.description}
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
                        {saleInfo.sale.isPublic ? "Public" : "Private"}
                      </p>
                    </Col>
                    <Col>
                      <p>
                        <span className="fw-bold">Hard Cap : </span>
                        {saleInfo ? formatEther(saleInfo.sale.hardCap) : 0} BNB
                      </p>
                    </Col>
                  </Row>

                  <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
                    <div className="w-25 fw-bold">Swap Rate</div>
                    <div className="text-primary">
                      : {saleData?.saleParams.softCap} -{" "}
                      {saleData?.saleParams.hardCap} Tokens
                    </div>
                  </div>

                  <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
                    <div className="w-25 fw-bold">Start / End</div>
                    <div className="text-primary">
                      : {saleData?.saleParams.softCap} -{" "}
                      {saleData?.saleParams.hardCap} Tokens
                    </div>
                  </div>

                  <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
                    <div className="w-25 fw-bold">Base Allocation</div>
                    <div className="text-primary">
                      : {saleData?.saleParams.softCap} -{" "}
                      {saleData?.saleParams.hardCap} Tokens
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
                />

                <BuyDetailCard
                  saleData={saleData}
                  tokenInfo={tokenInfo}
                  saleInfo={saleInfo}
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
