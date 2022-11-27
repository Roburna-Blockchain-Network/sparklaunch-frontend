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
import useIsParticipant from "hooks/useIsParticipant"
import useParticipationData from "hooks/useParticipationData"
import useGetRound from "hooks/useGetRound"
const DEFAULT_DATE_FORMAT = "MMM DD, h:mm A"

const BuyDetailCard = ({ sale }) => {
  const currentDate = dayjs.utc().unix()

  const { account, chainId, activateBrowserWallet, library } = useEthers()
  const [buyVal, setBuyVal] = useState(0)
  const [canBuy, setCanBuy] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [buttonStatus, setButtonStatus] = useState({
    disabled: true,
    text: "Please Wait",
    loading: false,
    init: true,
  })
  const [participate, setParticipate] = useState()

  const minBuy = Number(formatEther(BN.from(sale.info.minbuy)))
  const maxBuy = Number(formatEther(BN.from(sale.info.maxbuy)))

  const isPublic = sale.round.round1 == 0
  const isPublicRound =
    sale.round.public < currentDate && sale.round.end > currentDate

  const inProgress =
    sale.round.start < currentDate && sale.round.end > currentDate

  const getCurrentRound = useGetRound(sale.address)
  const userBalance = useEtherBalance(account)
  const isParticipant = useIsParticipant(sale.address, account)

  useEffect(async () => {
    if (!account) {
      return
    }
    try {
      const userParticipate = await getUserParticipation(sale.address, account)
      userParticipate.success ? setParticipate(userParticipate.data) : ""
      return
    } catch (error) {}
  }, [account])

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
    if (participate.token !== "0") {
      // console.log(userBalance)
      NotificationManager.error("Already Participated !", "Error")
      return
    }
    if (parseEther(buyVal.toString()).gt(userBalance)) {
      NotificationManager.error("You dont have enough money !", "Error")
      return
    }

    if (validBuyVal(buyVal)) {
      setEnabled(false)

      const saleContractAddress = saleData.address
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
      } catch (error) {
        console.log(error)
      }
      setEnabled(true)
    } else {
      NotificationManager.error("Buy Value Not Valid", "Error")
    }
  }

  // useEffect(() => {
  //   first

  //   return () => {
  //     second
  //   }
  // }, [isParticipant])

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
            placeholder="0"
            step="0.01"
            max={maxBuy}
            onChange={e => handleChangeValue(Number(e.target.value))}
          />
        </Form.Group>
      </div>
      <div className="my-2">
        {account ? (
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
              <>{buttonStatus.text.toUpperCase()}</>
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
            {inProgress ? "In Progress" : "Finished"}
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
