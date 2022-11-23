import React, { useState, useEffect } from "react"
import moment from "moment/moment"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { Button, Col, ProgressBar, Row, Form } from "react-bootstrap"
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
  const [buyVal, setBuyVal] = useState(0)
  const [canBuy, setCanBuy] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [participate, setParticipate] = useState()

  const minBuy = Number(formatEther(saleInfo.min))
  const maxBuy = Number(formatEther(saleInfo.max))
  const isPublic = saleInfo.isPublic

  const saleStart = BN.from(saleInfo.saleStart).toNumber()
  const saleEnd = BN.from(saleInfo.saleEnd).toNumber()

  const userBalance = useEtherBalance(account)
  const isUserAdmin = useIsAdmin(account)

  useEffect(async () => {
    console.log(isUserAdmin)
  }, [account, isUserAdmin])

  return <></>
}

export default AdminDetailCard
