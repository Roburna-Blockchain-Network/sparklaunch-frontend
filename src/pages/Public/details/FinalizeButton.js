import React from "react"
import { Button, Col, Row } from "react-bootstrap"
import { NotificationManager } from "react-notifications"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { isValidUrl } from "utils/helpers"
dayjs.extend(utc)

const FinalizeButton = ({ saleAddress }) => {
  return (
    <>
      <Row className="mt-3 font-size-10">
        <Col xs={6} className="text-center">
          <Button className="btn btn-success" onClick={e => console.log(e)}>
            {" "}
            Finalize Presale
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default FinalizeButton
