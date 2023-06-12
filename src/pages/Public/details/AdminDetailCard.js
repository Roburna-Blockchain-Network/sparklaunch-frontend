import React, { useState, useEffect } from "react"
import moment from "moment/moment"

import { Button, Col, ProgressBar, Row, Form, Modal } from "react-bootstrap"

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
  CHAIN_NUMBER,
} from "constants/Address"
import { Contract } from "@ethersproject/contracts"
import { NotificationManager } from "react-notifications"

import SaleAbi from "constants/abi/Sale.json"
import { getUserParticipation } from "utils/factoryHelper"
import { useSelector } from "react-redux"
import { BIG_ONE } from "utils/numbers"
import getUseIsAdmin from "hooks/useIsAdmin"
const DEFAULT_DATE_FORMAT = "MMM DD, h:mm A"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { isValidUrl } from "utils/helpers"
dayjs.extend(utc)

const AdminDetailCard = ({ sale }) => {
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

  const isUserAdmin = null

  const handleFeatured = async e => {
    // setIsProcessing(true)
    if (isFeatured) {
      if (!isValidUrl(featuredLink)) {
        NotificationManager.error("Link is not valid !", "Error")
        // setIsProcessing(false)
        return
      }
      // todo make request

      try {
        const input = JSON.stringify({
          _id: sale._id,
          featured: isFeatured,
          featuredImage: featuredLink,
        })

        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: input,
        }

        const response = await fetch(`${API_URL}featured`, requestOptions)
        const data = await response.json()

        NotificationManager.success(
          "Featured Info successfully updated!",
          "Success"
        )
        setShowModal(false)
      } catch (error) {
        NotificationManager.error("Error on backend !", "Error")
        // console.log(error)
      }
      return
    } else {
      // todo make request
      NotificationManager.success(
        "Featured Info successfully updated!",
        "Success"
      )
      // setIsProcessing(false)
      return
    }
  }

  const handleAudit = async e => {
    // setIsProcessing(true)
    if (!isValidUrl(kycLink) || !isValidUrl(auditLink)) {
      NotificationManager.error("Link is not valid !", "Error")
      // setIsProcessing(false)
      return
    }

    try {
      const input = JSON.stringify({
        _id: sale._id,
        kyc: kycLink,
        audit: auditLink,
      })

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: input,
      }

      const response = await fetch(`${API_URL}kyc`, requestOptions)
      const data = await response.json()

      NotificationManager.success(
        "Featured Info successfully updated!",
        "Success"
      )

      setTimeout(() => {
        window.location.reload()
      }, 6000)

      // setShowModal(false)
    } catch (error) {
      // console.log(error)
    }
    // setIsProcessing(false)
  }

  return (
    <>
      {isUserAdmin ? (
        <div className="buy-detail-card" id="buy-card">
          <div className="d-flex w-100 flex-wrap mb-0 py-1 border-white border-opacity-50">
            <Button
              className="btn buy-or-connect mb-3"
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
              onClick={() => {
                setFormTitle("Set Audit & KYC Info")
                setFormContent(2)
                setShowModal(true)
              }}
            >
              Set Audit & KYC
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
          <div className="p-4">
            {/* FORM FEATURED */}
            {formContent == 1 && (
              <>
                <div className="form-group mb-3">
                  <label>Is Featured</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="saleType1"
                      onChange={e => setIsFeatured(true)}
                      checked={isFeatured}
                    />
                    <label className="form-check-label" htmlFor="saleType1">
                      Yes
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="saleType"
                      id="saleType2"
                      onChange={e => setIsFeatured(false)}
                      checked={!isFeatured}
                    />
                    <label className="form-check-label" htmlFor="saleType2">
                      No
                    </label>
                  </div>
                </div>
                {isFeatured && (
                  <Form.Group className="mb-3" controlId="featuredLink">
                    <Form.Label>Featured Image Link </Form.Label>
                    <Form.Control
                      value={featuredLink}
                      onChange={e => setFeaturedLink(e.target.value)}
                      type="text"
                    />
                  </Form.Group>
                )}

                <div className="text-center">
                  <button
                    className="btn btn-primary px-3 fw-bolder w-50 text-nowrap"
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
                  <Form.Control
                    value={auditLink}
                    onChange={e => setAuditLink(e.target.value)}
                    type="text"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="kyc">
                  <Form.Label>KYC Link </Form.Label>
                  <Form.Control
                    value={kycLink}
                    onChange={e => setKycLink(e.target.value)}
                    type="text"
                  />
                </Form.Group>

                <div className="text-center">
                  <button
                    className="btn btn-primary px-3 fw-bolder w-50 text-nowrap"
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
          </div>
          <Modal.Body></Modal.Body>
        </div>
      </Modal>
    </>
  )
}

export default AdminDetailCard
