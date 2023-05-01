import React, { useEffect, useRef, useState } from "react"
import { MetaTags } from "react-meta-tags"

import { Col, Container, Form, Modal, Row, Spinner } from "react-bootstrap"
import moment from "moment/moment"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

import smLogo from "assets/images/logos/smlogo.png"
// import bscLogo from "assets/images/logos/bsc.png"
import bscLogo from "assets/images/logos/rba.svg"
import discordLogo from "assets/images/icons/discord.png"
import { useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom"
import { ChainId, useConfig, useEthers } from "@usedapp/core"
import { formatEther, formatUnits, parseUnits } from "ethers/lib/utils"
import SaleDetailCard from "./details/SaleDetailCard"
import { API_URL, CHAIN_NATIVE_SYMBOL, CHAIN_NUMBER } from "constants/Address"
import { getRoundInfo, getSaleInfo, getTokenInfo } from "utils/factoryHelper"
import { formatBigNumber } from "utils/numbers"
import BuyDetailCard from "./details/BuyDetailCard"
import { BigNumber } from "ethers"
import AdminDetailCard from "./details/AdminDetailCard"
import TokenInfo from "./details/TokenInfo"
import OwnerCard from "./details/OwnerCard"
import ParticipationCard from "./details/ParticipationCard"
import { formatBigToNum } from "utils/helpers"
import SocialLinks from "./home/SocialLinks"
import TokenImage from "components/TokenImage"
dayjs.extend(utc)

const DEFAULT_DATE_FORMAT = "MMM DD, h:mm A"
const currentDate = dayjs.utc()
const SaleDetails = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [sale, setSale] = useState()
  const [tokenPriceOriginal, setTokenPriceOriginal] = useState()
  const history = useHistory()
  const { id } = useParams()
  const mountedRef = useRef(true)
  const { account } = useEthers()

  useEffect(async () => {
    const abortController = new AbortController()
    try {
      const response = await fetch(`${API_URL}chain/${CHAIN_NUMBER}/id/${id}`, {
        signal: abortController.signal,
      })

      const res = await response.json()
      if (res.data.length == 0) {
        alert(`sale not found`)
        history.push("/")
      }
      console.log(res.data[0])
      setSale(res.data[0])
    } catch (error) {
      // console.log(error)
    }
    setReady(true)

    return () => {
      mountedRef.current = false
      abortController.abort()
    }
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      window.location.reload();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // console.log(sale.saleLinks.logo)

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Sale Participation | SparkLaunch</title>
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
                        <TokenImage
                          src={sale.saleLinks.logo}
                          height="100%"
                          width="100%"
                          objectFit="contain"
                          objectPosition="center"
                          alt={sale.token.symbol ? sale.token.symbol : "SPL"}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow-1">
                    <h3 className="text-primary mb-0 me-2 fw-bold">
                      {sale.name}
                    </h3>
                    <h5>{sale.token.symbol}</h5>
                  </div>

                  <div>
                    <div className="avatar-md me-3">
                      <div className="avatar-title bg-dark bg-soft rounded-circle overflow-hidden">
                        <img
                          src={"/images/bnb-chain-logo.png"}
                          style={{
                            height: "80px",
                            width: "80px",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="my-3 text-white font-size-12 line-truncate-2">
                  {sale.description}
                </p>

                <ul className="list-unstyled d-flex my-4">
                  <SocialLinks links={sale.saleLinks} />
                </ul>

                <div className="text-white font-size-14 mb-4">
                  <h5 className="text-primary">POOL DETAILS</h5>
                  <Row>
                    <Col>
                      <p>
                        <span className="fw-bold">Access Type : </span>
                        {sale.info.isPublic || sale.round.round1 == 0
                          ? "Public"
                          : "Private"}
                      </p>
                    </Col>
                  </Row>

                  <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
                    <div className="w-25 fw-bold">Presale Rate</div>
                    <div className="text-primary">
                      : 1 {CHAIN_NATIVE_SYMBOL} :{" "}
                      {formatBigToNum(
                        sale.info.saleRate,
                        sale.token.decimals,
                        0
                      )}{" "}
                      {sale.token.symbol}
                    </div>
                  </div>

                  <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
                    <div className="w-25 fw-bold">Dex Swap Rate</div>
                    <div className="text-primary">
                      : 1 {CHAIN_NATIVE_SYMBOL} :{" "}
                      {formatBigToNum(
                        sale.info.dexRate,
                        sale.token.decimals,
                        0
                      )}{" "}
                      {sale.token.symbol}
                    </div>
                  </div>

                  <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
                    <div className="w-25 fw-bold">Start / End</div>
                    <div className="text-primary">
                      :{" "}
                      {dayjs
                        .utc(sale.round.start * 1000)
                        .format(DEFAULT_DATE_FORMAT)}{" "}
                      -{" "}
                      {dayjs
                        .utc(sale.round.end * 1000)
                        .format(DEFAULT_DATE_FORMAT)}
                    </div>
                  </div>

                  <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
                    <div className="w-25 fw-bold">Soft Cap</div>
                    <div className="text-primary">
                      : {formatBigToNum(sale.info.softcap, 18, 0)}{" "}
                      {CHAIN_NATIVE_SYMBOL}
                    </div>
                  </div>

                  <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
                    <div className="w-25 fw-bold">Hard Cap</div>
                    <div className="text-primary">
                      : {formatBigToNum(sale.info.hardcap, 18, 0)}{" "}
                      {CHAIN_NATIVE_SYMBOL}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <Col md={9}>
                    <TokenInfo info={sale.token} presaleAddress={sale.address} contractAddress={sale.tokenAddress} />
                  </Col>
                </div>
              </Col>

              <Col md={4}>
                <SaleDetailCard sale={sale} />
                <BuyDetailCard sale={sale} />
                <ParticipationCard sale={sale} />
                <AdminDetailCard sale={sale} />
                <OwnerCard sale={sale} />
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default SaleDetails
