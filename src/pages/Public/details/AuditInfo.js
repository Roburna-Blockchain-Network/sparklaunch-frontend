import React from "react"
import { Button, Col, Row } from "react-bootstrap"
import { NotificationManager } from "react-notifications"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { isValidUrl } from "utils/helpers"
dayjs.extend(utc)

const AuditInfo = ({ audit, kyc }) => {
  const handleAudit = links => {
    if (typeof links == "undefined") {
      NotificationManager.info(
        "This Project still doesn't have AUDIT Yet !",
        "Info"
      )
      return
    }
    if (!isValidUrl(links)) {
      NotificationManager.info(
        "This Project still doesn't have AUDIT Yet !",
        "Info"
      )
      return
    }
    //  // console.log(audit)
    window.open(links, "_blank")
  }

  const handleKyc = links => {
    if (typeof links == "undefined") {
      NotificationManager.info(
        "This Project still doesn't have KYC Yet !",
        "Info"
      )
      return
    }
    if (!isValidUrl(links)) {
      NotificationManager.info(
        "This Project still doesn't have KYC Yet !",
        "Info"
      )
      return
    }
    //  // console.log(audit)
    window.open(links, "_blank")
  }

  return (
    <>
      <Row className="mt-3 font-size-10">
        {audit && isValidUrl(audit) ? (
          <Col xs={6} className="text-center">
            <Button
              className="btn btn-kyc"
              onClick={() => handleAudit(audit)}
              id="links"
            >
              {" "}
              AUDIT
            </Button>
          </Col>
        ) : (
          <></>
        )}
        {kyc && isValidUrl(kyc) ? (
          <Col xs={6} className="text-center">
            <Button
              className="btn btn-kyc"
              onClick={() => handleKyc(kyc)}
              id="links"
            >
              {" "}
              KYC
            </Button>
          </Col>
        ) : (
          <></>
        )}
      </Row>
    </>
  )
}

export default AuditInfo
