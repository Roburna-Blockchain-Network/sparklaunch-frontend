import React, { useState, useEffect } from "react"
import moment from "moment/moment"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { Button, Col, ProgressBar, Row, Form, Modal } from "react-bootstrap"
import { NotificationManager } from "react-notifications"

import { useEtherBalance, useEthers } from "@usedapp/core"
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers/lib/utils"
import { BigNumber, BigNumber as BN } from "ethers"
import {
  FACTORY_ADDRESS,
  API_URL,
  ROUTER_ADDRESS,
  ADMIN_ADDRESS,
} from "constants/Address"
import { Contract } from "@ethersproject/contracts"

import SaleAbi from "constants/abi/Sale.json"
import { getUserParticipation } from "utils/factoryHelper"
import { useSelector } from "react-redux"
import { BIG_ONE } from "utils/numbers"
import useIsAdmin from "hooks/useIsAdmin"
const DEFAULT_DATE_FORMAT = "MMM DD, h:mm A"

const AdminDetailCard = ({ saleData, tokenInfo, saleInfo, roundInfo }) => {
  const currentDate = dayjs.utc().unix()
  const { account, chainId, activateBrowserWallet, library } = useEthers()
  const [showModal, setShowModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formTitle, setFormTitle] = useState("Set Featured Sale")
  const [formContent, setFormContent] = useState(1)
  const [isFeatured, setIsFeatured] = useState(false)
  const [featuredLink, setFeaturedLink] = useState("")
  const [kycLink, setKycLink] = useState("")
  const [auditLink, setAuditLink] = useState("")

  const isUserAdmin = useIsAdmin(account)

  const handleFeatured = e => {
    e.prevent
    console.log(e)
  }

  const handleAudit = e => {
    e.prevent
    console.log(e)
  }

  // useEffect(async () => {
  //   console.log(isUserAdmin)
  // }, [account, isUserAdmin])

  return (
    <>
      {isUserAdmin ? (
        <div className="buy-detail-card" id="buy-card">
          <div class="d-flex w-100 flex-wrap mb-0 py-1 border-white border-opacity-50">
            <Button
              className="btn buy-or-connect mb-3"
              href="#"
              id="links"
              onClick={() => {
                setFormTitle("Set Featured Sale")
                setFormContent(1)
                setShowModal(true)
              }}
            >
              Set Featured Sale
            </Button>
            <Button
              className="btn buy-or-connect  mb-3"
              href="#"
              id="links"
              onClick={() => {
                setFormTitle("Set Audit & KYC Info")
                setFormContent(2)
                setShowModal(true)
              }}
            >
              Set Audit & KYT
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}

      <Modal
        backdrop="static"
        size="lg"
        show={showModal}
        centered
        onHide={() => setShowModal(false)}
      >
        <div className="modal-content">
          <Modal.Header>
            <span className="text-primary fs-4">Form {formTitle}</span>
            <button
              className="btn border-0"
              data-bs-dismiss="modal"
              onClick={e => setShowModal(false)}
            >
              X
            </button>
          </Modal.Header>
          <Form className="m-3">
            {/* FORM FEATURED */}
            {formContent == 1 && (
              <>
                <Form.Group className="mb-3" controlId="amount">
                  <Form.Label>Featured Image Links </Form.Label>

                  <Form.Control type="text" />
                </Form.Group>

                <div className="text-center">
                  <button
                    className="btn btn-primary px-3 fw-bolder w-50 text-nowrap"
                    type="submit"
                    onClick={handleFeatured}
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
                      "Submit"
                    )}
                  </button>
                </div>
              </>
            )}

            {/* FORM KYC */}
            {formContent == 2 && (
              <>
                <Form.Group className="mb-3" controlId="audit">
                  <Form.Label>Audit Link </Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="kyc">
                  <Form.Label>KYC Link </Form.Label>
                  <Form.Control type="text" />
                </Form.Group>

                <div className="text-center">
                  <button
                    className="btn btn-primary px-3 fw-bolder w-50 text-nowrap"
                    type="submit"
                    onClick={handleAudit}
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
                      "Submit"
                    )}
                  </button>
                </div>
              </>
            )}
          </Form>
          <Modal.Body></Modal.Body>
        </div>
      </Modal>
    </>
  )
}

export default AdminDetailCard
