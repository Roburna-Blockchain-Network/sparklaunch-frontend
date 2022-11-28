import React, { useState, useEffect } from "react"
import moment from "moment/moment"

import {
  Button,
  Col,
  ProgressBar,
  Row,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap"

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
import useSaleInfo from "hooks/useSaleInfo"
import useIsAdmin from "hooks/useIsAdmin"
const DEFAULT_DATE_FORMAT = "MMM DD, h:mm A"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import useSaleFinished from "hooks/useSaleIsFinished"
import useSaleIsSuccess from "hooks/useSaleIsSuccess"
import { Link } from "react-router-dom"
dayjs.extend(utc)

const OwnerCard = ({ sale }) => {
  const currentDate = dayjs.utc().unix()
  const { account, library } = useEthers()
  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSaleOwner, setIsSaleOwner] = useState(false)
  const [isAlreadyEnd, setIsAlreadyEnd] = useState(false)
  const [finalize, setFinalize] = useState(false)

  const isUserAdmin = useIsAdmin(account)

  const handleConfirm = async e => {
    setIsProcessing(true)

    const saleContractAddress = sale.address
    const contract = new Contract(
      saleContractAddress,
      SaleAbi,
      library.getSigner()
    )

    try {
      const tx = await contract.finishSale()
      await tx.wait()
      NotificationManager.success(
        `${finalize ? "Finalize " : "Cancel "} Sale is Success  `,
        "Thanks",
        3000
      )
      setTimeout(() => {
        window.location.reload()
      }, 4000)
      return
    } catch (error) {
      NotificationManager.error(
        `${finalize ? "Finalize " : "Cancel "} Sale is Fail`,
        "Sorry"
      )
    }

    setTimeout(() => {
      setIsProcessing(false)
      setShowModal(false)
    }, 2000)
  }
  const handleWithdraw = async e => {
    setIsProcessing(true)
    setShowModal2(true)

    const saleContractAddress = sale.address
    const contract = new Contract(
      saleContractAddress,
      SaleAbi,
      library.getSigner()
    )

    try {
      const tx = await contract.withdrawEarnings()
      await tx.wait()
      NotificationManager.success(`Withdraw Completed`, "Thanks", 3000)
      setTimeout(() => {
        window.location.reload()
      }, 4000)
      return
    } catch (error) {
      NotificationManager.error(`There error on withdrawing fund`, "Sorry")
    }

    setTimeout(() => {
      setIsProcessing(false)
      setShowModal2(false)
    }, 2000)
  }

  const isFinished = useSaleFinished(sale.address)
  const isSaleSuccess = useSaleIsSuccess(sale.address)
  const getInfo = useSaleInfo(sale.address)
  // console.log(`isSaleSuccess`, isSaleSuccess)

  useEffect(() => {
    if (isFinished) {
      setIsAlreadyEnd(true)
    }
  }, [isFinished])

  const isSaleTimeEnd = sale.round.end < currentDate

  const lockAddress = `/token-locker/` + sale.address
  useEffect(() => {
    if (typeof getInfo == "undefined") {
      return
    }
    if (account == getInfo.saleOwner) {
      setIsSaleOwner(true)
    } else {
      setIsSaleOwner(false)
    }
    const newFinalize = BigNumber.from(sale.info.softcap).lte(
      getInfo.totalBNBRaised
    )

    setFinalize(newFinalize)
  }, [getInfo, account])

  return (
    <>
      {isUserAdmin || isSaleOwner ? (
        <div className="buy-detail-card" id="buy-card">
          <div className="d-flex w-100 flex-wrap mb-0 py-1 border-white border-opacity-50 justify-content-center">
            <div className="fs-5 fw-bold mb-2">SALE OWNER ADMINISTRATION</div>
            {isAlreadyEnd || !isSaleTimeEnd ? null : (
              <Button
                disabled={isAlreadyEnd || !isSaleTimeEnd}
                className="btn btn buy-or-connect mb-3"
                onClick={() => {
                  setShowModal(true)
                }}
              >
                {finalize ? "FINALIZE SALE" : "CANCEL SALE"}
              </Button>
            )}
            {isSaleSuccess && getInfo?.earningsWithdrawn === false ? (
              <Button
                className="btn btn buy-or-connect mb-3"
                disabled={isProcessing}
                onClick={e => {
                  handleWithdraw()
                }}
              >
                WITHDRAW EARNING
              </Button>
            ) : (
              <Link to={lockAddress} className="btn btn buy-or-connect mb-3">
                SHOW LOCK LP PAGE
              </Link>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}

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
                Are you sure want to {finalize ? "Finalize " : "Cancel "} this
                sale ?
              </div>
              <button
                className="btn btn-primary px-3 fw-bolder w-100 text-nowrap mb-3"
                disabled={isProcessing}
                onClick={e => handleConfirm(e)}
              >
                YES {finalize ? " FINALIZE SALE" : " CANCEL SALE"}
              </button>
              <button
                className="btn btn-primary px-3 fw-bolder w-100 text-nowrap"
                disabled={isProcessing}
                onClick={e => setShowModal(false)}
              >
                NO
              </button>
            </div>
          </div>
          <Modal.Body></Modal.Body>
        </div>
      </Modal>
      <Modal
        backdrop="static"
        size="sm"
        show={showModal2}
        centered
        onHide={() => setShowModal2(false)}
      >
        <div className="modal-content">
          <Modal.Header>
            <span className="text-primary fs-4">Processing...</span>
          </Modal.Header>
          <div className="p-4">
            <div className="text-center">
              <div className="mb-3 fs-4">Please wait .....</div>
              <Spinner animation="border" />
            </div>
          </div>
          <Modal.Body></Modal.Body>
        </div>
      </Modal>
    </>
  )
}

export default OwnerCard
