import React from "react"
import moment from "moment/moment"

import { Col, ProgressBar, Row } from "react-bootstrap"

import discordLogo from "assets/images/icons/discord.png"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"

const SaleCard = ({ sale }) => {
  const currentDate = moment().unix()
  let history = useHistory()

  const handleClick = e => {
    if (e.target.id === "social") {
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
          <h4 className="text-primary mb-0">{sale.saleToken?.name}</h4>
          <h5>{sale.saleToken.symbol ? sale.saleToken.symbol : "SPL"}</h5>
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
                alt={sale.saleToken.symbol ? sale.saleToken.symbol : "SPL"}
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
        <Row>
          <Col xs={6}>SoftCap</Col>
          <Col xs={6} className="text-primary">
            {sale.saleParams.softCap} Token
          </Col>
        </Row>

        <Row>
          <Col xs={6}>Raised</Col>
          <Col xs={6} className="text-primary">
            {sale.saleParams.raised} BNB
          </Col>
        </Row>

        <Row>
          <Col xs={6}>Price</Col>
          <Col xs={6} className="text-primary">
            {sale.saleParams.price} BNB
          </Col>
        </Row>

        <Row>
          <Col xs={6}>End</Col>
          <Col xs={6} className="text-primary">
            {moment.unix(sale.saleParams.endDate).format("llll")}
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
          <Col xs={6}>Holders</Col>
          <Col xs={6}>Listing Time</Col>

          <Col xs={6} className="text-primary">
            {sale.saleDetails.holders}
          </Col>
          <Col xs={6} className="text-primary">
            {moment(sale.saleDetails.listingDate).format("llll")}
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default SaleCard
