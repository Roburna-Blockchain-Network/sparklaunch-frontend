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

import { BNB, useEtherBalance, useEthers } from "@usedapp/core"
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers/lib/utils"
import { BigNumber } from "ethers"
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
import getUseSaleInfo from "hooks/useSaleInfo"
//import getUseIsAdmin from "hooks/useIsAdmin"
const DEFAULT_DATE_FORMAT = "MMM DD, h:mm A"
import Web3 from "web3"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import getUseSaleFinished from "hooks/useSaleIsFinished"
import getUseSaleIsSuccess from "hooks/useSaleIsSuccess"
import { Link } from "react-router-dom"
import { get } from "jquery"
dayjs.extend(utc)

const OwnerCard = ({ sale }) => {
  const currentDate = dayjs.utc().unix()
  const {  library } = useEthers()
  const [showModal, setShowModal] = useState(false)
  const[account,setAccount] = useState(null)
  const [showModal2, setShowModal2] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSaleOwner, setIsSaleOwner] = useState(false)
  const [isAlreadyEnd, setIsAlreadyEnd] = useState(false)
  const [finalize, setFinalize] = useState(false)
  const [getInfo, setGetInfo] = useState(null)
  const [isFinished, setIsFinished] = useState(null)
  const [earningsWithdrawn, setEarningsWithdrawn] = useState(null)
  const [BNBRaised, setBNBRaised] = useState(null)
  const [owner, setOwner] = useState(null)
  // const [isUserAdmin, setIsUserAdmin] = useState(null)
  const [isSaleSuccess, setIsSaleSuccess] = useState(null)


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
        `${finalize ? "Finalize " : "Cancel "} Sale is Fail,
        Reason : ${error?.data?.message}`,
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

  // console.log(`isSaleSuccess`, isSaleSuccess)

  async function isAdmin () {
    if (typeof window.ethereum !== "undefined") {
      // Instance web3 with the provided information
      const web3 = new Web3(window.ethereum)
      try {
        // Request account access
        await window.ethereum.enable()
        // Wallet connected successfully
        // You can perform further actions here
        const act = await web3.eth.getAccounts()
        setAccount(act[0])
      } catch (e) {
        // User denied access
        console.log(e)
        NotificationManager.error("Please connect your wallet", "Error")
      }
    }

  }
  
  async function getSaleSuccess () {
    const res = await getUseSaleIsSuccess(sale.address)
    setIsSaleSuccess(res)
  }

  async function getSaleInfo () {
    const res = await getUseSaleInfo(sale.address)
    setGetInfo(res)
  }
  async function getFinished () {
    const res = await getUseSaleFinished(sale.address)
    setIsFinished(res)
  }
  async function getOwner () {
    if (!getInfo) return
    const res = await getInfo.saleOwner
    setOwner(res)
  }

  async function getBNBRaised() {
    if (!getInfo) return;
    const res = await getInfo.totalBNBRaised
    const temp = BigNumber.from(res.toString())
    setBNBRaised(temp)
  }

  async function getEarningsWithdrawn() {
    if (!getInfo) return;
    const res = await getInfo.earningsWithdrawn
    setEarningsWithdrawn(res)
  }

  useEffect(() => {
    getFinished()
    getSaleInfo()
    isAdmin()
    getSaleSuccess()
  }, [])


  useEffect(() => {
    if (isFinished == null) return;
    if (isFinished) {
      
      setIsAlreadyEnd(true)
    }
  }, [isFinished])

  useEffect(() => {
    if (getInfo == null) return
    getOwner()
    getBNBRaised()
    getEarningsWithdrawn()
  }, [getInfo])

  const isSaleTimeEnd = sale.round.end < currentDate

  const lockAddress = `/token-locker/` + sale.address
  useEffect(() => {
    if (typeof getInfo == null||BNBRaised == null||owner == null) {
      return
    }
    if (account == owner ) {
      setIsSaleOwner(true)
    } else {
      setIsSaleOwner(false)
    }
    const newFinalize = BigNumber.from(sale.info.softcap).lte(
      BigNumber.from(BNBRaised.toString())
    )

    setFinalize(newFinalize)
  }, [getInfo, account, BNBRaised, owner])

  return (
    <React.Fragment>
      {isSaleOwner ? (
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
                {finalize ? "FINALIZE SALE" : "WITHDRAW LEFTOVER"}
              </Button>
            )}
            {isSaleSuccess && earningsWithdrawn === false ? null : (
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

              {isProcessing ?
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Processing...</span>
                  </div>
                </div>
                : <React.Fragment>
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
                </React.Fragment>
              }
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
    </React.Fragment>
  )
}

export default OwnerCard
