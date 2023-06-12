import React, { useState, useEffect } from "react"
import moment from "moment/moment"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { Button, Col, ProgressBar, Row, Form, Spinner } from "react-bootstrap"
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
  CHAIN_NATIVE_SYMBOL,
} from "constants/Address"
import { Contract } from "@ethersproject/contracts"

import SaleAbi from "constants/abi/Sale.json"
import { getUserParticipation } from "utils/factoryHelper"
import { useSelector } from "react-redux"
import { BIG_ONE } from "utils/numbers"
import getUseIsParticipant from "hooks/useIsParticipant"
import getUseParticipationData from "hooks/useParticipationData"
import getUseGetRound from "hooks/useGetRound"
import Web3 from "web3"
const DEFAULT_DATE_FORMAT = "MMM DD, h:mm A"

const BuyDetailCard = ({ sale }) => {
  const currentDate = dayjs.utc().unix()

  const { activateBrowserWallet, library } = useEthers()
  const [buyVal, setBuyVal] = useState()
  const [canBuy, setCanBuy] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [balanceBNB, setBalanceBNB] = useState(null)
  const [getCurrentRound, setCurrentRound] = useState(null)
  const [isParticipant, setIsParticipant] = useState(null)
  const [account, setAccount] = useState(null)
  const [buttonStatus, setButtonStatus] = useState({
    disabled: true,
    text: "Please Wait",
    loading: false,
    init: true,
  })
  const [participate, setParticipate] = useState()

  const minBuy = Number(formatEther(BN.from(sale.info.minbuy)))
  const maxBuy = Number(formatEther(BN.from(sale.info.maxbuy)))

  const isPublic = sale.info.isPublic || sale.round.round1 == 0
  const isPublicRound =
    sale.round.public < currentDate && sale.round.end > currentDate

  const inProgress =
    sale.round.start < currentDate && sale.round.end > currentDate

  const isStarted = sale.round.start < currentDate

  async function getRoundInfo() {
    const round = await getUseGetRound(sale.address)
    setCurrentRound(round)
  }
  async function getIsParticipant() {
    const isParticipant = await getUseIsParticipant(sale.address, account)
    setIsParticipant(isParticipant)
  }

  const validBuyVal = val => {
    return val >= minBuy && val <= maxBuy
  }

  const handleChangeValue = val => {
    let newVal = buyVal
    if (val > maxBuy) {
      return
    } else {
      newVal = val
    }
    setBuyVal(newVal)
  }

  const handleBuyButton = async () => {
    if (balanceBNB == null) return
    setButtonStatus({
      loading: true,
    })
    console.log(buyVal.toString())
    console.log(balanceBNB.toString())
    console.log(buyVal.toString())
    console.log(parseEther(buyVal.toString()).lt(balanceBNB))
    if (parseEther(buyVal.toString()).gt(balanceBNB)) {
      console.log(buyVal.toString(), balanceBNB.toString())
      NotificationManager.error("You dont have enough money !", "Error")
      setButtonStatus({
        loading: false,
        text: `BUY ${sale.token.name}`,
      })
      return
    }

    if (validBuyVal(buyVal)) {
      const saleContractAddress = sale.address
      const contract = new Contract(
        saleContractAddress,
        SaleAbi,
        library.getSigner()
      )
      const amountBuy = parseEther(buyVal.toString()).toString()

      try {
        const tx = await contract.participate("0", {
          value: amountBuy,
        })
        await tx.wait()
        NotificationManager.success("Thanks for participation", "Thanks")
        setButtonStatus({
          ...buttonStatus,
          loading: false,
          disabled: true,
          text: `Already Paricipated`,
        })
        setTimeout(() => {
          window.location.reload()
        }, 3000)
        return
      } catch (error) {
        if (error.message.includes("user rejected transaction")) {
          NotificationManager.info(
            "Please Approve Metamask to continue buying",
            "Error",
            3000
          )
        }
        if (error.message.includes("Already participated")) {
          NotificationManager.info("Sorry, Already participated", "Error", 3000)
        }
        if (error.message.includes("Wrong Round")) {
          NotificationManager.info(
            "Sorry, Wrong Round! or You're not in Whitelist!",
            "Error",
            3000
          )
        }
        setButtonStatus({
          ...buttonStatus,
          loading: false,
          text: `BUY ${sale.token.name}`,
        })
      }
    } else {
      NotificationManager.error("Buy Value Not Valid", "Error")
      setButtonStatus({
        ...buttonStatus,
        loading: false,
        text: `BUY ${sale.token.name}`,
      })
    }
    setButtonStatus({
      ...buttonStatus,
      loading: false,
    })
  }

  useEffect(() => {
    async function connectWallet() {
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
          try {
            web3.eth.getBalance(act[0]).then(res => {
              setBalanceBNB(res)
            })
          } catch (e) {
            console.log(e)
          }
        } catch (e) {
          // User denied access
          console.log(e)
          NotificationManager.error("Please connect your wallet", "Error")
        }
      }
    }

    connectWallet()
    getRoundInfo()
  }, [])

  useEffect(() => {
    if (account === null) return
    getIsParticipant()
  }, [account])

  useEffect(() => {
    if (typeof isParticipant == "undefined") {
      return
    }
    let stateDisabled = isParticipant || !inProgress
    let textButton = `BUY ${sale.token.name}`

    if (isParticipant) {
      textButton = "Already Participated"
      stateDisabled = true
    }

    if (!inProgress) {
      textButton = "Sale Ended"
      stateDisabled = true
    }

    if (!isStarted) {
      textButton = "Sale Not Started"
      stateDisabled = true
    }

    if (buttonStatus.init) {
      setButtonStatus({
        ...buttonStatus,
        init: false,
        disabled: stateDisabled,
        text: textButton,
      })
    }
  }, [isParticipant, isStarted, inProgress])
  // console.log(`isParticipant :`, isParticipant)
  // console.log(`button :`, buttonStatus)
  return (
    <div className="buy-detail-card" id="buy-card">
      <div className="my-2">
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>
            Amount In {CHAIN_NATIVE_SYMBOL} (max {maxBuy})
          </Form.Label>
          <Form.Control
            value={buyVal}
            type="number"
            step="0.01"
            max={maxBuy}
            onChange={e => handleChangeValue(Number(e.target.value))}
          />
        </Form.Group>
      </div>
      <div className="my-2">
        {account != null ? (
          <Button
            disabled={buttonStatus.disabled}
            className="btn buy-or-connect"
            onClick={() => handleBuyButton()}
          >
            {buttonStatus.loading || buttonStatus.init ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                {buttonStatus.init ? "PLEASE WAIT ...." : "PROCESSING..."}
              </>
            ) : (
              <>{buttonStatus?.text?.toUpperCase()}</>
            )}
          </Button>
        ) : (
          <Button
            className="btn buy-or-connect"
            onClick={() => activateBrowserWallet()}
          >
            CONNECT WALLET
          </Button>
        )}
      </div>
      <div className="text-white font-size-11">
        <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50"></div>
        <div className="d-flex w-100 flex-wrap justify-content-between mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-25 fw-bold">Status</div>
          <div className={inProgress ? "text-primary" : "text-danger"}>
            {inProgress
              ? "In Progress"
              : isStarted
              ? "Finished"
              : "Not Started"}
          </div>
        </div>
        <div className="d-flex w-100 flex-wrap justify-content-between mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-25 fw-bold">Sale type</div>
          <div className="text-white">
            {isPublic ? "Public Sale" : "Private Whitelist"}
          </div>
        </div>
        <div className="d-flex w-100 flex-wrap justify-content-between mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-25 fw-bold">Min Buy</div>
          <div className="text-white">
            {minBuy} {CHAIN_NATIVE_SYMBOL}
          </div>
        </div>
        <div className="d-flex w-100 flex-wrap justify-content-between mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-25 fw-bold">Max Buy</div>
          <div className="text-white">
            {maxBuy} {CHAIN_NATIVE_SYMBOL}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyDetailCard
