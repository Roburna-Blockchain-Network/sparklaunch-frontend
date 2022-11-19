import React, { useEffect } from "react"
import moment from "moment/moment"

import { Button, Col, ProgressBar, Row } from "react-bootstrap"

import discordLogo from "assets/images/icons/discord.png"
import { Link, useHistory, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import useTokenInfo from "hooks/useTokenInfo"
import { useEtherBalance } from "@usedapp/core"
import { formatEther, parseEther } from "ethers/lib/utils"
import useSaleInfo from "hooks/useSaleInfo"
import { BigNumber as BN } from "ethers"

const SaleCard = ({ sale }) => {
  const currentDate = moment().unix()
  let history = useHistory()
  const users = useSelector(state => state.User)

  /**
   * info
   */
  // const saleBalance = useEtherBalance(sale.saleToken.address, {
  //   chainId: users.selectedChain,
  // })
  const tokenInfo = useTokenInfo(sale?.saleToken.address)
  const saleInfo = useSaleInfo(sale?.address)
  const formattedRaised = saleInfo ? formatEther(saleInfo?.totalBNBRaised) : 0
  // console.log(saleInfo)
  const handleClick = e => {
    if (e.target.id === "social" || e.target.id === "links") {
      void 0
    } else {
      history.push(`/sale/${sale.id}`)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="sale-card"
      id="sale-card"
      style={{ cursor: "pointer" }}
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
                src={sale.saleLinks?.logo}
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

      {sale.saleParams.startDate > currentDate && (
        <span className="bg-primary text-dark fw-bold px-2 rounded-pill font-size-11 me-2">
          UPCOMING
        </span>
      )}
      {sale.saleParams.startDate < currentDate && (
        <span className="bg-primary text-dark fw-bold px-2 rounded-pill font-size-11 me-2">
          LIVE
        </span>
      )}
      {sale.saleParams.endDate < currentDate && (
        <span className="bg-primary text-dark fw-bold px-2 rounded-pill font-size-11 me-2">
          ENDED
        </span>
      )}

      <p className="my-2 text-white font-size-12 line-truncate-2">
        {sale.saleDetails.description}
      </p>

      <div className="text-white font-size-11">
        <Row className="mb-2">
          <Col xs={4}>Total Raise </Col>
          <Col xs={8} className="text-primary fs-6 text-end fw-bold">
            {formattedRaised} BNB
          </Col>
        </Row>

        <Row className="mb-2">
          <Col xs={4}>Starts</Col>
          <Col xs={8} className="text-primary fs-6 text-end fw-bold">
            {moment.unix(sale.saleParams.startDate).format("lll")}
          </Col>
        </Row>

        <Row className="mb-2">
          <Col xs={4}>Price</Col>
          <Col xs={8} className="text-primary fs-6 text-end fw-bold">
            {saleInfo ? formatEther(saleInfo?.tokenPriceInBNB) : 0} BNB
          </Col>
        </Row>
      </div>

      <div>
        <div className="mt-3 d-flex justify-content-between font-size-11">
          <span className="text-white">{sale.saleDetails.diff}</span>
          <span className="text-primary">{sale.saleDetails.percentage} %</span>
        </div>

        <ProgressBar variant="primary" now={sale.saleDetails.percentage} />

        <Row className="mt-3 font-size-10">
          <Col xs={4}>1x (approx)</Col>
          <Col xs={8} className="text-end">
            Listing Time
          </Col>

          <Col xs={4} className="text-primary fs-6 fw-bold">
            {sale.saleDetails.holders}
          </Col>
          <Col xs={8} className="text-primary text-end fs-6 fw-bold">
            {moment.unix(sale.saleParams.endDate).format("lll")}
          </Col>
        </Row>
        <Row className="mt-3 font-size-10">
          <Col xs={6} className="text-center">
            <Button className="btn btn-kyc" href="#" id="links">
              {" "}
              AUDIT
            </Button>
          </Col>
          <Col xs={6} className="text-center">
            <Button className="btn btn-kyc" href="#" id="links">
              {" "}
              KYC
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default SaleCard
