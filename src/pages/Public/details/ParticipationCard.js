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
  CHAIN_NATIVE_SYMBOL,
} from "constants/Address"
import { Contract } from "@ethersproject/contracts"
import { NotificationManager } from "react-notifications"

import SaleAbi from "constants/abi/Sale.json"
import { getUserParticipation } from "utils/factoryHelper"
import { useSelector } from "react-redux"
import { BIG_ONE } from "utils/numbers"
import useIsAdmin from "hooks/useIsAdmin"
const DEFAULT_DATE_FORMAT = "MMM DD, h:mm A"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { isValidUrl } from "utils/helpers"
import useIsParticipant from "hooks/useIsParticipant"
import useParticipationData from "hooks/useParticipationData"
import useSaleFinished from "hooks/useSaleIsFinished"
import useSaleIsSuccess from "hooks/useSaleIsSuccess"
dayjs.extend(utc)

const ParticipationCard = ({ sale }) => {
  const currentDate = dayjs.utc().unix()
  const { account, chainId, activateBrowserWallet, library } = useEthers()
  const [showModal, setShowModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const isParticipant = useIsParticipant(sale.address, account)
  const contribution = useParticipationData(sale.address, account)
  const isSaleFinish = useSaleFinished(sale.address)
  const isSaleSuccess = useSaleIsSuccess(sale.address)

  const handleConfirm = async e => {
    setIsProcessing(true)

    const saleContractAddress = sale.address
    const contract = new Contract(
      saleContractAddress,
      SaleAbi,
      library.getSigner()
    )

    try {
      const tx = await contract.withdraw()
      await tx.wait()
      NotificationManager.success(
        `Withdraw ${isSaleSuccess ? sale.token.symbol : CHAIN_NATIVE_SYMBOL
        } is Success  `,
        "Thanks"
      )
    } catch (error) {
      NotificationManager.error(
        `${isSaleSuccess ? sale.token.symbol : CHAIN_NATIVE_SYMBOL} is Fail`,
        "Sorry"
      )
    }

    setTimeout(() => {
      setIsProcessing(false)
      setShowModal(false)
    }, 2000)
  }

  return (
    <>
      <div className="buy-detail-card" id="buy-card">
        <div className="d-flex w-100 flex-wrap mb-0 py-1 border-white border-opacity-50 justify-content-center">
          <div className="fs-5 fw-bold mb-2">YOUR CONTRIBUTION</div>
        </div>
        <div className="text-white font-size-11 mb-3">
          <div className="d-flex w-100 flex-wrap justify-content-between mb-0 py-1 border-bottom border-white border-opacity-50"></div>
          <div className="d-flex w-100 flex-wrap justify-content-between mb-0 py-1 border-bottom border-white border-opacity-50">
            <div className="fw-bold">Bought </div>
            {contribution && (
              <div className="text-white">
                {formatUnits(contribution[0], sale.token.decimals)}{" "}
                {sale.token.symbol}
              </div>
            )}
          </div>
          <div className="d-flex w-100 flex-wrap justify-content-between mb-0 py-1 border-bottom border-white border-opacity-50">
            <div className="fw-bold">Paid </div>
            {contribution && (
              <div className="text-white">
                {formatUnits(contribution[1], 18)} {CHAIN_NATIVE_SYMBOL}
              </div>
            )}
          </div>
        </div>
        {isParticipant && isSaleFinish ? (
          <Button
            className="btn buy-or-connect mb-2"
            onClick={() => {
              setShowModal(true)
            }}
          >
            WITHDRAW {isSaleSuccess ? sale.token.symbol : CHAIN_NATIVE_SYMBOL}
          </Button>
        ) : (
          <></>
        )}
      </div>

      <Modal
        backdrop="static"
        size="sm"
        show={showModal}
        centered
        onHide={() => setShowModal(false)}
      >
        <div className="modal-content">
          <Modal.Header>
            <span className="text-primary fs-4">Confirmation</span>
          </Modal.Header>
          <div className="p-4">
            <div className="text-center">
              <div className="mb-3 fs-4">
                Are you sure want to Withdraw{" "}
                {isSaleSuccess ? sale.token.symbol : CHAIN_NATIVE_SYMBOL}{" "}
              </div>
              {isProcessing ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    className="btn btn-primary px-3 fw-bolder w-100 text-nowrap mb-3"
                    disabled={isProcessing}
                    onClick={e => handleConfirm(e)}
                  >
                    YES
                  </button>
                  <button
                    className="btn btn-primary px-3 fw-bolder w-100 text-nowrap"
                    disabled={isProcessing}
                    onClick={e => setShowModal(false)}
                  >
                    NO
                  </button>
                </div>
              )
              }
            </div>
          </div>
          <Modal.Body></Modal.Body>
        </div>
      </Modal>
    </>
  )
}

export default ParticipationCard
