import React, { useState, useEffect } from "react"
import moment from "moment/moment"

import { Button, Col, ProgressBar, Row, Form } from "react-bootstrap"

import { useEtherBalance, useEthers } from "@usedapp/core"
import { formatEther, parseEther } from "ethers/lib/utils"
import { BigNumber as BN } from "ethers"
import {
  FACTORY_ADDRESS,
  API_URL,
  ROUTER_ADDRESS,
  ADMIN_ADDRESS,
} from "constants/Address"
import { Contract } from "@ethersproject/contracts"

import SaleAbi from "constants/abi/Sale.json"

const BuyDetailCard = ({ saleData, tokenInfo, saleInfo }) => {
  const currentDate = moment.utc().unix()
  //   const [saleStatus, setSaleStatus] = useState()

  const { account, chainId, activateBrowserWallet, library } = useEthers()

  const [buyVal, setBuyVal] = useState(0)
  const [canBuy, setCanBuy] = useState(false)

  const sale = saleData

  const minBuy = Number(formatEther(saleInfo.min))
  const maxBuy = Number(formatEther(saleInfo.max))
  const isPublic = saleInfo.sale.isPublic

  const saleStart = BN.from(saleInfo.saleStart).toNumber()
  const saleEnd = BN.from(saleInfo.sale.saleEnd).toNumber()

  let saleStatus = ""
  if (saleStart > currentDate) {
    saleStatus = "Not Started"
  } else if (saleStart < currentDate && saleEnd > currentDate) {
    saleStatus = "In Progress"
  } else if (saleEnd < currentDate) {
    saleStatus = "Finished"
  }

  const validBuyVal = val => {
    return val >= minBuy && val <= maxBuy
  }

  const handleChangeValue = val => {
    let newVal = buyVal
    if (val > maxBuy) {
      return
    } else if (val < minBuy) {
      newVal = minBuy
    } else {
      newVal = val
    }
    setBuyVal(newVal)
  }

  const publicRoundStartDelta = BN.from(
    saleInfo.publicRoundStartDelta
  ).toNumber()
  const getCurrentRound = BN.from(saleInfo.getCurrentRound).toNumber()
  //   const getCurrentRound = BN.from(saleInfo.getCurrentRound).toNumber()
  const tierIdToTierStartTime = BN.from(
    saleInfo.tierIdToTierStartTime
  ).toNumber()
  console.log()
  console.log(`publicRoundStartDelta :`, publicRoundStartDelta)
  //   console.log(`getCurrentRound :`, getCurrentRound)
  console.log(`tierIdToTierStartTime :`, tierIdToTierStartTime)
  console.log(`bcdate :`, publicRoundStartDelta + tierIdToTierStartTime)
  console.log(`now :`, currentDate)
  console.log(
    `selisih :`,
    publicRoundStartDelta + tierIdToTierStartTime - currentDate
  )
  console.log(getCurrentRound)

  const handleBuyButton = async () => {
    if (validBuyVal(buyVal)) {
      const saleContractAddress = saleData.address
      const contract = new Contract(
        saleContractAddress,
        SaleAbi,
        library.getSigner()
      )
      const amountBuy = parseEther(buyVal.toString()).toString()
      try {
        const estimation = await contract.estimateGas.participate("0", {
          value: amountBuy,
        })
      } catch (error) {
        console.log(error.message)
        return
      }

      try {
        const tx = await contract.participate("0", {
          value: amountBuy,
        })
        await tx.wait()
      } catch (error) {
        console.log(error)
      }
    } else {
      alert("Buy Value is not valid")
    }
  }

  useEffect(() => {
    if (account && saleStatus == "In Progress") {
      setCanBuy(true)
      return
    }
    setCanBuy(false)
  }, [account, saleStatus])

  return (
    <div className="buy-detail-card" id="buy-card">
      <div className="my-2">
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>amount</Form.Label>
          <Form.Control
            // defaultValue={buyVal}
            value={buyVal}
            type="number"
            placeholder="0"
            step=".0000001"
            min={minBuy}
            max={maxBuy}
            onKeyUp={e => handleChangeValue(Number(e.target.value))}
            onChange={e => handleChangeValue(Number(e.target.value))}
          />
        </Form.Group>
      </div>
      <div className="my-2">
        {canBuy && account ? (
          <Button
            className="btn buy-or-connect"
            href="#"
            id="links"
            onClick={() => handleBuyButton()}
          >
            BUY
          </Button>
        ) : (
          <Button
            className="btn buy-or-connect"
            href="#"
            id="links"
            // onClick={() => activateBrowserWallet()}
          >
            SALE IS NOT STARTED
          </Button>
        )}
        {!account && (
          <Button
            className="btn buy-or-connect"
            href="#"
            id="links"
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
          <div className="text-white">{saleStatus}</div>
        </div>
        <div className="d-flex w-100 flex-wrap justify-content-between mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-25 fw-bold">Sale type</div>
          <div className="text-white">
            {isPublic ? "Public Sale" : "Private Whitelist"}
          </div>
        </div>
        <div className="d-flex w-100 flex-wrap justify-content-between mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-25 fw-bold">Min Buy</div>
          <div className="text-white">{minBuy} BNB</div>
        </div>
        <div className="d-flex w-100 flex-wrap justify-content-between mb-0 py-1 border-bottom border-white border-opacity-50">
          <div className="w-25 fw-bold">Max Buy</div>
          <div className="text-white">{maxBuy} BNB</div>
        </div>
      </div>
    </div>
  )
}

export default BuyDetailCard