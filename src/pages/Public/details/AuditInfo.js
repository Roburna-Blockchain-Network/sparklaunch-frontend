import React from "react"
import { Button, Col, Row } from "react-bootstrap"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

const AuditInfo = ({ info }) => {
  return (
    <>
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
    </>
  )
}

export default AuditInfo
