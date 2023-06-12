import React, { useState, useEffect } from "react"
import { MetaTags } from "react-meta-tags"
import { useContractFunction, useEthers, useToken } from "@usedapp/core"
import { Contract } from "@ethersproject/contracts"

import { Col, Container, Form, Row, Spinner } from "react-bootstrap"
import { Link, Redirect, useHistory } from "react-router-dom"
import { DatePicker } from "antd"

import dayjs from "dayjs"

import utc from "dayjs/plugin/utc"
import { BigNumber, ethers, utils } from "ethers"
import getUseDeploymentFee from "hooks/useDeploymentFee"
import { NotificationManager } from "react-notifications"

import {
  FACTORY_ADDRESS,
  API_URL,
  ROUTER_ADDRESS,
  ADMIN_ADDRESS,
  CHAIN_NUMBER,
  CHAIN_NATIVE_SYMBOL,
} from "constants/Address"

import FactoryAbi from "constants/abi/Factory.json"
import ERCAbi from "constants/abi/ERC20.json"
import { saveData } from "connect/dataProccessing"
import {
  formatEther,
  formatUnits,
  isAddress,
  parseEther,
  parseUnits,
} from "ethers/lib/utils"
import moment from "moment"
import { tokenRate } from "utils/helpers"
import { useSelector } from "react-redux"
import { getTokenAllowance } from "utils/factoryHelper"
import { BIG_TEN } from "utils/numbers"
import getUseServiceFee from "hooks/useServiceFee"
import Modal from "components/Modal"
import FinalModal from "components/FinalModal"
dayjs.extend(utc)
const ProjectSetup = () => {
  let history = useHistory()
  const { account, chainId, library, activateBrowserWallet } = useEthers()

  let servicesFee
  const user = useSelector(state => state.User)

  const [activeTab, setActiveTab] = useState(1)
  const [step1, setStep1] = useState(null)
  const [white1, setWhite1] = useState(null)
  const [white2, setWhite2] = useState(null)
  const [white3, setWhite3] = useState(null)
  const [white4, setWhite4] = useState(null)
  const [white5, setWhite5] = useState(null)
  const [show, setShow] = useState(false)

  const [step2, setStep2] = useState({
    softCap: 0,
    hardCap: 0,
    minBuy: 0,
    maxBuy: 0,
    presaleRate: 0,
    listingRate: 0,
    startTime: 0,
    endTime: 0,
    publicTime: 0,
    liquidityPercent: 0,
    liquidityLock: 0,
    round1: 0,
    round2: 0,
    round3: 0,
    round4: 0,
    round5: 0,
    isPublic: true,
  })

  const [valid2, setValid2] = useState({
    softCap: true,
    hardCap: true,
    minBuy: true,
    maxBuy: true,
    presaleRate: true,
    listingRate: true,
    startTime: true,
    endTime: true,
    publicTime: true,
    liquidityPercent: true,
    liquidityLock: true,
    round1: true,
    round2: true,
    round3: true,
    round4: true,
    round5: true,
    isPublic: true,
  })

  const [step2data, setStep2data] = useState({
    softCap: 0,
    hardCap: 0,
    minBuy: 0,
    maxBuy: 0,
    presaleRate: 0,
    listingRate: 0,
    startTime: 0,
    endTime: 0,
    publicTime: 0,
    liquidityPercent: 0,
    liquidityLock: 0,
    round1: 0,
    round2: 0,
    round3: 0,
    round4: 0,
    round5: 0,
    isPublic: true,
  })
  const [isAble, setIsAble] = useState(false)

  const [step3, setStep3] = useState(null)
  const [description, setDescription] = useState("")
  const [tokenInfo, setTokenInfo] = useState({
    address: "",
    name: "",
    decimal: "",
    symbol: "",
  })

  const [isValidStep1, setIsValidStep1] = useState(false)
  const [userAllow, setUserAllow] = useState("0")
  const [requiredToken, setRequiredToken] = useState("0")
  const [displayInfo, setDisplayInfo] = useState(false)

  const [deploymentFee, setDeploymentFee] = useState(0.0)
  const [serviceFee, setServiceFee] = useState(0.0)

  const [isLoading, setIsLoading] = useState(false)
  const [isPrivateSale, setIsPrivateSale] = useState(false)
  const [saleType, setSaleType] = useState("public")
  let deployFee

  async function getFee() {
    deployFee = await getUseDeploymentFee()

    servicesFee = await getUseServiceFee()

  }

  useEffect(() => {
    getFee()
  }, [deployFee, servicesFee])

  const handleSubmit1 = async event => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()

    // const isAlreadyApprove = await handleBeforeSubmit({
    //   address: form.address.value,
    // })

    const isAlreadyApprove = true

    if (isAlreadyApprove) {
      setStep1({
        title: form.title.value,
        // symbol: form.symbol.value,
        address: form.address.value,
        // price: form.price.value,
      })

      setActiveTab(activeTab + 1)
    } else {
      alert("error")
    }
  }

  useEffect(async () => {
    if(!deployFee) return
    const feeVal = ethers.utils.formatEther(deployFee.toString())
    setDeploymentFee(feeVal)
  }, [deployFee])

  useEffect(async () => {
    if(!servicesFee) return
    const feeVal = ethers.utils.formatUnits(servicesFee.toString(), "4")
    setServiceFee(feeVal * 100)
  }, [servicesFee])
  const validateStep2 = async () => {
    /**
     * check initial
     */
    console.log(`step2 :`, step2)
    if (
      step2.softCap === 0 ||
      step2.hardCap === 0 ||
      step2.minBuy === 0 ||
      step2.maxBuy === 0 ||
      step2.presaleRate === 0 ||
      step2.listingRate === 0 ||
      step2.startTime === 0 ||
      step2.endTime === 0 ||
      step2.publicTime === 0 ||
      step2.liquidityPercent === 0 ||
      step2.liquidityLock === 0
    ) {
      NotificationManager.error("Please enter valid data !", "Error", 3000)
      return false
    }

    if (!step2.isPublic) {
      if (
        step2.round1 === 0 ||
        step2.round2 === 0 ||
        step2.round3 === 0 ||
        step2.round4 === 0 ||
        step2.round5 === 0
      ) {
        NotificationManager.error(
          "Please enter valid round info !",
          "Error",
          3000
        )
        return false
      } else if (step2.round1 >= step2.round2) {
        NotificationManager.error("Round 2 must After Round 1 !", "Error", 3000)
        return false
      } else if (step2.round2 >= step2.round3) {
        NotificationManager.error("Round 3 must After Round 2 !", "Error", 3000)
        return false
      } else if (step2.round3 >= step2.round4) {
        NotificationManager.error("Round 4 must After Round 3 !", "Error", 3000)
        return false
      } else if (step2.round4 >= step2.round5) {
        NotificationManager.error("Round 5 must After Round 4 !", "Error", 3000)
        return false
      } else if (step2.round5 >= step2.publicTime) {
        NotificationManager.error(
          "Round 5 must Before Public Round !",
          "Error",
          3000
        )
        return false
      }
    }

    if (step2.minBuy > step2.maxBuy) {
      NotificationManager.error(
        "Minimum buy must below Maximum Buy !",
        "Error",
        3000
      )
      return false
    }

    if (step2.startTime > step2.endTime) {
      NotificationManager.error(
        "Start Sale Time must before End Sale Time !",
        "Error",
        3000
      )
      return false
    }

    if (step2.startTime > step2.publicTime) {
      NotificationManager.error(
        "Start Time must before Public Sale Time !",
        "Error",
        3000
      )
      return false
    }

    if (step2.publicTime > step2.endTime) {
      NotificationManager.error(
        "Public Sale Time must before End Sale Time !",
        "Error",
        3000
      )
      return false
    }
    const amountRequired = parseUnits(
      requiredToken,
      BigNumber.from(tokenInfo.decimal)
    )
    if (BigNumber.from(userAllow).lt(amountRequired)) {
      // console.log(userAllow)

      const res = await handleBeforeSubmit(requiredToken)
      console.log(`res :`, res)
      if (!res) {
        NotificationManager.error(
          "Please Approve Allowance Transaction on Metamask !",
          "Error",
          3000
        )
        return false
      }
    }

    const userBalance = await handleCheckBalance()
    // console.log(`userBalance :`, userBalance)
    if (!userBalance) {
      NotificationManager.error(
        `Make sure you have enough  ${tokenInfo.name} to make Launchpad!`,
        "Error",
        3000
      )
      return false
    }

    return true
  }

  const handleClose = () => {
    setShow(false)
    deployToken()
  }

  const handleSubmit2 = async event => {
    const form = event.currentTarget
    console.log(step2)
    setIsLoading(true)
    event.preventDefault()
    event.stopPropagation()
    //  // console.log(step2)

    const isValid = await validateStep2()

    if (isValid) {
      setIsLoading(false)
      setActiveTab(activeTab + 1)
    }

    setIsLoading(false)

    //  // console.log(step2data)
  }

  const handleSubmit3 = event => {
    const form = event.currentTarget
    console.log(`form :`, form)
    event.preventDefault()
    event.stopPropagation()

    setStep3({
      logo: form.logo.value,
      website: form.website.value,
      facebook: form.facebook.value,
      twitter: form.twitter.value,
      github: form.github.value,
      telegram: form.telegram.value,
      instagram: form.instagram.value,
      discord: form.discord.value,
      reddit: form.reddit.value,
      youtube: form.youtube.value,
    })

    setActiveTab(activeTab + 1)
  }

  const handleBackButton = () => {
    setActiveTab(activeTab - 1)
    setIsLoading(false)
  }

  const handleWhite = data => {
    if (!data) return []
    const result = data
      .split(",")
      .map(e => {
        return e.trim().replace(/\n/g, "")
      })
      .filter(isAddress)
    return result
  }

  const createWhitelist = () => {
    let wl = []
    let tier = []

    const w1 = handleWhite(white1)
    const w2 = handleWhite(white2)
    const w3 = handleWhite(white3)
    const w4 = handleWhite(white4)
    const w5 = handleWhite(white5)

    for (const addr of w1) {
      wl.push(addr)
      tier.push("1")
    }
    for (const addr of w2) {
      wl.push(addr)
      tier.push("2")
    }
    for (const addr of w3) {
      wl.push(addr)
      tier.push("3")
    }
    for (const addr of w4) {
      wl.push(addr)
      tier.push("4")
    }
    for (const addr of w5) {
      wl.push(addr)
      tier.push("5")
    }

    return [tier, wl]
  }
  // console.log(deploymentFee.toString())
  // console.log(utils.parseEther(deploymentFee))

  const handleDeploySale = async data => {
    const factoryContractAddress = FACTORY_ADDRESS
    const contract = new Contract(
      factoryContractAddress,
      FactoryAbi,
      library.getSigner()
    )

    const routerAddress = ROUTER_ADDRESS
    const adminAddress = ADMIN_ADDRESS

    console.log("We are deploying your sale 1")

    let TIERS_ROUND = []
    let WL_ROUND = []
    if (data.info.isPublic) {
      TIERS_ROUND = [1]
      WL_ROUND = [adminAddress]
    } else {
      ;[TIERS_ROUND, WL_ROUND] = createWhitelist()
    }

    console.log("We are deploying your sale 2")
    const START_SALE = data.start
    const END_SALE = data.end
    const PUBLIC_DELTA = data.round.public - data.round.round5

    let startTimes = []
    let isPublic = data.info.isPublic

    startTimes.push(data.round.round1)
    startTimes.push(data.round.round2)
    startTimes.push(data.round.round3)
    startTimes.push(data.round.round4)
    startTimes.push(data.round.round5)

    console.log("We are deploying your sale 3")
    try {
      const saleId = await contract.getNumberOfSalesDeployed()
      const tx = await contract.deployNormalSale(
        [routerAddress, adminAddress, data.tokenAddress, account],
        [
          data.info.minbuy,
          data.info.maxbuy,
          data.info.lpPercent,
          data.info.dexRate,
          data.info.liquidityLock,
          data.info.saleRate,
          END_SALE,
          START_SALE,
          PUBLIC_DELTA,
          data.info.hardcap,
          data.info.softcap,
        ],
        WL_ROUND,
        TIERS_ROUND,
        startTimes,
        isPublic,
        { value: utils.parseEther(deploymentFee.toString()) }
      )
      await tx.wait()

      const deployedAddress = await contract.saleIdToAddress(saleId.toNumber())
      console.log(deployedAddress)

      return [saleId.toNumber(), deployedAddress]
    } catch (error) {
      console.log(error)
    }
  }

  const handleBeforeSubmit = async data => {
    const factoryContractAddress = FACTORY_ADDRESS
    const contract = new Contract(
      tokenInfo.address,
      ERCAbi,
      library.getSigner()
    )

    const amount = ethers.constants.MaxUint256
    console.log(`amount`, amount)

    try {
      const approval = await contract.approve(factoryContractAddress, amount)

      await approval.wait()
    } catch (error) {
      console.log(error)
      return false
    }
    setUserAllow(amount.toString())
    return true
  }

  const handleCheckBalance = async data => {
    const contract = new Contract(
      tokenInfo.address,
      ERCAbi,
      library.getSigner()
    )
    const amountRequired = parseUnits(
      requiredToken,
      BigNumber.from(tokenInfo.decimal)
    )
    try {
      const userbal = await contract.balanceOf(account)

      if (userbal.gt(amountRequired)) return true
      // console.log(`userbal`, userbal.toString())
      // console.log(`amountRequired`, amountRequired.toString())
      return false
    } catch (error) {
      console.log(error)
    }
  }

  const saveToBackend = async value => {
    const input = JSON.stringify(value)
    // console.log(input)
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: input,
      }

      const response = await fetch(`${API_URL}chain`, requestOptions)
      const data = await response.json()
      let id = await data._id

      return true
    } catch (e) {
      console.log("Err: ", e.message)
      return false
    }
  }

  const handleSubmitFinal = async event => {
    event.preventDefault()
    event.stopPropagation()
    setShow(true)
  }

  const deployToken = async event => {
    setIsLoading(true)

    const values = {
      name: step1?.title,
      tokenAddress: tokenInfo.address,
      tokenName: tokenInfo.name,
      start: step2?.startTime,
      end: step2?.endTime,
      round: {
        round1: step2.isPublic ? step2?.startTime + 1 : step2?.round1,
        round2: step2.isPublic ? step2?.startTime + 2 : step2?.round2,
        round3: step2.isPublic ? step2?.startTime + 3 : step2?.round3,
        round4: step2.isPublic ? step2?.startTime + 4 : step2?.round4,
        round5: step2.isPublic ? step2?.startTime + 5 : step2?.round5,
        start: step2?.startTime,
        end: step2?.endTime,
        public: step2.isPublic ? step2?.startTime + 10 : step2?.publicTime,
      },
      info: {
        softcap: parseEther(step2.softCap.toString()).toString(),
        hardcap: parseEther(step2.hardCap.toString()).toString(),
        maxbuy: parseEther(step2.maxBuy.toString()).toString(),
        minbuy: parseEther(step2.minBuy.toString()).toString(),
        saleRate: parseUnits(
          step2.presaleRate.toString(),
          tokenInfo.decimal
        ).toString(),
        dexRate: parseUnits(
          step2.listingRate.toString(),
          tokenInfo.decimal
        ).toString(),
        lpPercent: (step2.liquidityPercent * 100).toString(),
        liquidityLock: (step2?.liquidityLock * 86400).toString(),
        isPublic: step2.isPublic,
      },
      token: {
        name: tokenInfo.name,
        decimals: tokenInfo.decimal,
        symbol: tokenInfo.symbol,
        totalSupply: tokenInfo.totalSupply,
      },
      saleLinks: {
        logo: step3?.logo,
        fb: step3?.facebook,
        git: step3?.github,
        insta: step3?.instagram,
        reddit: step3?.reddit,
        web: step3?.website,
        twitter: step3?.twitter,
        telegram: step3?.telegram,
        discord: step3?.discord,
        youtube: step3?.youtube,
      },
      description: description,
    }
    // console.log(values)
    try {
      const [id, contractAddress] = await handleDeploySale(values)

      // console.log(id, contractAddress)
      values.id = id
      values.address = contractAddress
      values.chainId = chainId

      const dbId = await saveToBackend(values)
      if (dbId) {
        setIsLoading(false)
        history.push(`/sale/${id}`)
      } else {
        console.log(`backend error`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addressValidation = async e => {
    const inputtedAddress = e.target.value
    setDisplayInfo(false)
    setIsValidStep1(false)

    const validAddress = isAddress(inputtedAddress)
    // console.log(validAddress)
    if (!validAddress) {
      return
    }
    const response = await fetch(
      `${API_URL}check/${CHAIN_NUMBER}/${inputtedAddress}`
    )

    const data = await response.json()
    if (data.success === false) {
      e.target.focus()
      return
    }

    setTokenInfo({
      address: inputtedAddress,
      name: data.data.name,
      symbol: data.data.symbol,
      decimal: data.data.decimal,
      totalSupply: data.data.totalSupply,
    })
    setDisplayInfo(true)
    setIsValidStep1(true)
  }

  useEffect(async () => {
    if (activeTab == 2 && account) {
      try {
        const allow = await getTokenAllowance(tokenInfo.address, account)
        if (allow.success) {
          setUserAllow(allow.data.allowance)
        }

        // console.log(allow)
      } catch (error) {}
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab != 2) {
      return
    }
    if (
      step2.hardCap > 0 &&
      step2.softCap > 0 &&
      step2.listingRate > 0 &&
      step2.presaleRate > 0
    ) {
      const hardCapBNB = parseUnits(step2.hardCap.toString(), "18")
      const presaleRateToken = BigNumber.from(step2.presaleRate.toString())
      const listingRateToken = BigNumber.from(step2.listingRate)

      const reqHard = hardCapBNB
        .mul(presaleRateToken)
        .div(parseUnits("1", tokenInfo.decimal.toString()))

      const reqLP = hardCapBNB
        .mul(listingRateToken)
        .div(parseUnits("1", tokenInfo.decimal.toString()))
      const presaleRateBNB = tokenRate(presaleRateToken, "18")

      setRequiredToken(reqHard.add(reqLP).toString())
    }

    return () => {}
  }, [step2.hardCap, step2.softCap, step2.listingRate, step2.presaleRate])

  const steps = [
    {
      step: 1,
      title: "Before you start",
      desc: "Input your title, and choose the currency",
    },
    {
      step: 2,
      title: "Private Sale",
      desc: "Enter the launchpad information that you want to raise, that should be enter all details about your presale",
    },
    {
      step: 3,
      title: "Additional Info",
      desc: "Let people know who you are",
    },
    {
      step: 4,
      title: "Finish",
      desc: "Review your information",
    },
  ]

  const activeStepHead = (item, isActive) => {
    return isActive ? (
      <div className="d-flex flex-nowrap">
        <div>
          <div className="avatar-xs">
            <div className="avatar-title rounded">{item.step}</div>
          </div>
        </div>

        <div className="ps-2">
          <h4 className="text-primary">{item.title}</h4>
          <p className="text-muted font-size-13">{item.desc}</p>
        </div>
      </div>
    ) : (
      <div className="d-flex flex-nowrap opacity-50">
        <div>
          <div className="avatar-xs">
            <div className="avatar-title rounded bg-black">{item.step}</div>
          </div>
        </div>
        <div className="ps-2">
          <h4>{item.title}</h4>
          <p style={{ fontSize: 13 }}>{item.desc}</p>
        </div>
      </div>
    )
  }

  // useEffect(() => {
  //   //  // console.log(white1)
  //   let new_key = []
  //   let new_array = white1
  //     .trim()
  //     .replace(/\n/g, "")
  //     .split(",")
  //     .map(e => {
  //       return e.replace(/\n/g, "")
  //     })
  //     .map(e => {
  //       return e.trim()
  //     })
  //     .filter(e => {
  //       return e.length > 1
  //     })
  //   new_array.forEach(e => {
  //     new_key.push("1")
  //   })
  // }, [white1])

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Project Setup | SparkLaunch</title>
        </MetaTags>
        <FinalModal show={show} handleClose={handleClose} />
        <Modal />

        <Container fluid>
          <div className="text-end">
            <Link
              to="/"
              className="btn btn-lg bg-primary fw-bold text-black m-3 px-3"
            >
              Close
            </Link>
          </div>

          <div className="featured-card bg-dark p-4 my-2 rounded-4">
            {/* STEPPER HEAD */}
            <div className="row flex-nowrap overflow-auto">
              {steps.map((step, i) => (
                <div className="col-3 px-4" key={i}>
                  {activeStepHead(step, activeTab >= i + 1 ? true : false)}
                </div>
              ))}
            </div>

            {/* FORM 1 */}
            {activeTab === 1 && (
              <Form onSubmit={handleSubmit1}>
                <p className="form-text" style={{ color: "#5ce65c" }}>
                  (*) is required field
                </p>

                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    defaultValue={step1?.title}
                    placeholder="Ex. This is my private sale..."
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Token Address *</Form.Label>
                  <Form.Control
                    defaultValue={step1?.address}
                    placeholder="Ex. 0x...q34f"
                    required
                    onChange={addressValidation}
                  />
                  <Form.Text className="text-primary">
                    Pool creation fee: {deploymentFee} {CHAIN_NATIVE_SYMBOL}
                  </Form.Text>
                </Form.Group>
                {displayInfo && (
                  <Form.Group className="mb-2">
                    <p className="form-text fs-5 text-white">
                      Token Name : {tokenInfo.name}
                    </p>
                    <p className="form-text fs-5 text-white">
                      Token Symbol : {tokenInfo.symbol}
                    </p>
                    <p className="form-text fs-5 text-white">
                      Token Decimals : {tokenInfo.decimal}
                    </p>
                  </Form.Group>
                )}

                <Form.Group className="mb-2">
                  <Form.Label>Currency</Form.Label>
                  <Form.Check
                    id="currency"
                    type="radio"
                    defaultChecked
                    label={CHAIN_NATIVE_SYMBOL}
                    required
                  />
                  <Form.Text className="text-primary">
                    Users will pay with {CHAIN_NATIVE_SYMBOL} for your token
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Fee Info</Form.Label>
                  <p className="form-text text-info">
                    Pool creation fee: {deploymentFee} {CHAIN_NATIVE_SYMBOL}{" "}
                    <br />
                    Pool service fee: {serviceFee.toFixed(2)} %
                  </p>
                  <p className="form-text text-info"></p>
                </Form.Group>

                {/* <Form.Group className="mb-2">
                  <DatePicker showTime onChange={onChange} onOk={onOk} />
                </Form.Group> */}

                <div className="text-end">
                  <button
                    disabled={!isValidStep1 || !account}
                    className="btn btn-primary px-3 fw-bolder"
                    type="submit"
                  >
                    Next {">>"}
                  </button>
                </div>
              </Form>
            )}

            {/* FORM 2 */}
            {activeTab === 2 && (
              <Form onSubmit={handleSubmit2}>
                <p className="mb-3 fs-5">Set Sale Params</p>

                <Row>
                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="softcap"
                  >
                    <Form.Label>SoftCap ({CHAIN_NATIVE_SYMBOL})</Form.Label>
                    <Form.Control
                      defaultValue={step2?.softCap}
                      type="number"
                      placeholder="0"
                      onChange={e =>
                        setStep2(prevState => {
                          return {
                            ...prevState,
                            softCap: Number(e.target.value),
                          }
                        })
                      }
                    />
                    {/* <p className="form-text text-info">
                      Softcap must be {">="} 50% of Hardcap!
                    </p> */}
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="hardcap"
                  >
                    <Form.Label>Hardcap ({CHAIN_NATIVE_SYMBOL}) *</Form.Label>
                    <Form.Control
                      defaultValue={step2?.hardCap}
                      type="number"
                      placeholder="0"
                      required
                      onChange={e =>
                        setStep2(prevState => {
                          return {
                            ...prevState,
                            hardCap: Number(e.target.value),
                          }
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="minbuy"
                  >
                    <Form.Label>
                      Minimum Buy({CHAIN_NATIVE_SYMBOL}) *
                    </Form.Label>
                    <Form.Control
                      defaultValue={step2?.minBuy}
                      type="number"
                      placeholder="0"
                      step=".0001"
                      min="0"
                      required
                      onChange={e =>
                        setStep2(prevState => {
                          return {
                            ...prevState,
                            minBuy: Number(e.target.value),
                          }
                        })
                      }
                    />
                    <p className="form-text text-info">
                      Minimum Buy must be {"<"} Maximum Buy!
                    </p>
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="maxbuy"
                  >
                    <Form.Label>
                      Maximum Buy({CHAIN_NATIVE_SYMBOL}) *
                    </Form.Label>
                    <Form.Control
                      defaultValue={step2?.maxBuy}
                      type="number"
                      placeholder="0"
                      step=".0001"
                      min="0"
                      required
                      onChange={e =>
                        setStep2(prevState => {
                          return {
                            ...prevState,
                            maxBuy: Number(e.target.value),
                          }
                        })
                      }
                    />
                    <p className="form-text text-info">
                      Maximum Buy must be {">"} Minimum Buy
                    </p>
                  </Form.Group>
                  <Form.Group className="mb-2" as={Col} controlId="price">
                    <Form.Label>Token Presale Rate *</Form.Label>
                    <Form.Control
                      defaultValue={step2?.presaleRate}
                      type="number"
                      placeholder="0"
                      step="1"
                      min="0"
                      required
                      onChange={e =>
                        setStep2(prevState => {
                          return {
                            ...prevState,
                            presaleRate: Number(e.target.value),
                          }
                        })
                      }
                    />
                    <p className="form-text text-info">
                      If I spend 1 {CHAIN_NATIVE_SYMBOL} how many tokens will I
                      receive?
                    </p>
                  </Form.Group>
                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="listingPrice"
                  >
                    <Form.Label>Exchange Listing Rate *</Form.Label>
                    <Form.Control
                      defaultValue={step2?.listingRate}
                      type="number"
                      required
                      placeholder="0"
                      step="1"
                      onChange={e =>
                        setStep2(prevState => {
                          return {
                            ...prevState,
                            listingRate: Number(e.target.value),
                          }
                        })
                      }
                    />
                    <p className="form-text text-info">
                      If I spend 1 {CHAIN_NATIVE_SYMBOL} how many tokens will I
                      receive? Usually this amount is lower than presale rate to
                      allow for a higher listing price on Dex Exchange
                    </p>
                  </Form.Group>

                  <p className="form-text text-center text-warning pb-2 pt-2 mb-2 fs-5  border-top border-bottom border-white border-opacity-50">
                    Need {requiredToken} {tokenInfo.symbol} to create launchpad.
                  </p>

                  <p className="mb-3 fs-5">Set Date Parameters</p>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="startdt"
                  >
                    <Form.Label>Start time (UTC) *</Form.Label>
                    <DatePicker
                      format="YYYY-MM-DD HH:mm"
                      allowClear="false"
                      defaultValue={
                        step2.startTime > 0
                          ? dayjs.utc(dayjs.unix(step2.startTime))
                          : dayjs.utc()
                      }
                      showTime={{
                        format: "HH:mm",
                      }}
                      onChange={(value, date) => {
                        setStep2(prevState => {
                          return {
                            ...prevState,
                            startTime: moment.utc(date).unix(),
                          }
                        })
                      }}
                    />
                    <p className="form-text text-info">
                      Sale Start Time MUST BE Sale End Time and Public Sale Time
                    </p>
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="enddt"
                  >
                    <Form.Label>End time (UTC) *</Form.Label>
                    <DatePicker
                      placeholder="Select End Date"
                      format="YYYY-MM-DD HH:mm"
                      allowClear="false"
                      defaultValue={
                        step2.endTime > 0
                          ? dayjs.utc(dayjs.unix(step2.endTime))
                          : dayjs.utc()
                      }
                      showTime={{
                        format: "HH:mm",
                      }}
                      onChange={(value, date) => {
                        setStep2(prevState => {
                          return {
                            ...prevState,
                            endTime: moment.utc(date).unix(),
                          }
                        })
                      }}
                    />
                    <p className="form-text text-info">
                      Sale End Time MUST after Sale Start Time and Public Sale
                      Time
                    </p>
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="publicDate"
                  >
                    <Form.Label>Public Round Start Date *</Form.Label>
                    <DatePicker
                      placeholder="Select End Date"
                      format="YYYY-MM-DD HH:mm"
                      showTime={{
                        format: "HH:mm",
                      }}
                      allowClear="false"
                      defaultValue={
                        step2.publicTime > 0
                          ? dayjs.utc(dayjs.unix(step2.publicTime))
                          : dayjs.utc()
                      }
                      onChange={(value, date) => {
                        setStep2(prevState => {
                          return {
                            ...prevState,
                            publicTime: moment.utc(date).unix(),
                          }
                        })
                      }}
                    />
                    <p className="form-text text-info">
                      Public Sale Time MUST BETWEEN Start Time and Public Time
                    </p>
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="liquidityPercent"
                  >
                    <Form.Label>Liquidity (%)</Form.Label>
                    <Form.Control
                      defaultValue={step2?.liquidityPercent}
                      type="number"
                      min="51"
                      max="100"
                      placeholder="51"
                      step="1"
                      required
                      onChange={e =>
                        setStep2(prevState => {
                          return {
                            ...prevState,
                            liquidityPercent: Number(e.target.value),
                          }
                        })
                      }
                    />
                    <p className="form-text text-info">
                      Liquidity percentage MUST Between 51 and 100
                    </p>
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="liquidityLock"
                  >
                    <Form.Label>Liquidity Lock (days)</Form.Label>
                    <Form.Control
                      defaultValue={step2?.liquidityLock}
                      type="number"
                      min="1"
                      placeholder="5"
                      step="1"
                      required
                      onChange={e =>
                        setStep2(prevState => {
                          return {
                            ...prevState,
                            liquidityLock: Number(e.target.value),
                          }
                        })
                      }
                    />
                    <p className="form-text text-info">
                      Please input Liquidity Lock in days
                    </p>
                  </Form.Group>
                </Row>
                <Row>
                  <div className="form-group">
                    <label>Sale Type</label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        value="public"
                        name="saleType"
                        id="saleType1"
                        onChange={e =>
                          setStep2(prevState => {
                            return {
                              ...prevState,
                              isPublic: true,
                            }
                          })
                        }
                        checked={step2.isPublic}
                      />
                      <label className="form-check-label" htmlFor="saleType1">
                        Public
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        value="private"
                        name="saleType"
                        id="saleType2"
                        onChange={e =>
                          setStep2(prevState => {
                            return {
                              ...prevState,
                              isPublic: false,
                            }
                          })
                        }
                        checked={!step2.isPublic}
                      />
                      <label className="form-check-label" htmlFor="saleType2">
                        Whitelist
                      </label>
                    </div>
                  </div>
                </Row>
                {!step2.isPublic && (
                  <>
                    <p className="mb-3 mt-3 fs-5">Set Sale Rounds</p>
                    <Row>
                      <Form.Text className="text-primary mb-2">
                        Enter the times and dates you wish each round to start.
                        Rounds must start and end prior to public round start
                        time and after sale start time.
                      </Form.Text>
                      <Form.Group
                        className="mb-2"
                        as={Col}
                        md={6}
                        lg={4}
                        controlId="round1"
                      >
                        <Form.Label>Rounds 1 </Form.Label>
                        <DatePicker
                          placeholder="Select Round 1 Date"
                          format="YYYY-MM-DD HH:mm"
                          showTime={{
                            format: "HH:mm",
                          }}
                          allowClear="false"
                          defaultValue={
                            step2.round1 > 0
                              ? dayjs.utc(dayjs.unix(step2.round1))
                              : dayjs.utc()
                          }
                          onChange={(value, date) => {
                            setStep2(prevState => {
                              return {
                                ...prevState,
                                round1: moment.utc(date).unix(),
                              }
                            })
                          }}
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-2"
                        as={Col}
                        md={6}
                        lg={4}
                        controlId="round2"
                      >
                        <Form.Label>Round 2 *</Form.Label>
                        <DatePicker
                          placeholder="Select Round 2 Date"
                          format="YYYY-MM-DD HH:mm"
                          showTime={{
                            format: "HH:mm",
                          }}
                          allowClear="false"
                          defaultValue={
                            step2.round2 > 0
                              ? dayjs.utc(dayjs.unix(step2.round2))
                              : dayjs.utc()
                          }
                          onChange={(value, date) => {
                            setStep2(prevState => {
                              return {
                                ...prevState,
                                round2: moment.utc(date).unix(),
                              }
                            })
                          }}
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-2"
                        as={Col}
                        md={6}
                        lg={4}
                        controlId="round3"
                      >
                        <Form.Label>Round 3 *</Form.Label>
                        <DatePicker
                          placeholder="Select Round 3 Date"
                          format="YYYY-MM-DD HH:mm"
                          showTime={{
                            format: "HH:mm",
                          }}
                          allowClear="false"
                          defaultValue={
                            step2.round3 > 0
                              ? dayjs.utc(dayjs.unix(step2.round3))
                              : dayjs.utc()
                          }
                          onChange={(value, date) => {
                            setStep2(prevState => {
                              return {
                                ...prevState,
                                round3: moment.utc(date).unix(),
                              }
                            })
                          }}
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-2"
                        as={Col}
                        md={6}
                        lg={4}
                        controlId="round4"
                      >
                        <Form.Label>Rounds 4 (Hrs) *</Form.Label>
                        <DatePicker
                          placeholder="Select Round 4 Date"
                          format="YYYY-MM-DD HH:mm"
                          showTime={{
                            format: "HH:mm",
                          }}
                          allowClear="false"
                          defaultValue={
                            step2.round4 > 0
                              ? dayjs.utc(dayjs.unix(step2.round4))
                              : dayjs.utc()
                          }
                          onChange={(value, date) => {
                            setStep2(prevState => {
                              return {
                                ...prevState,
                                round4: moment.utc(date).unix(),
                              }
                            })
                          }}
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-2"
                        as={Col}
                        md={6}
                        lg={4}
                        controlId="round5"
                      >
                        <Form.Label>Round 5 (Hrs) *</Form.Label>
                        <DatePicker
                          placeholder="Select Round 5 Date"
                          format="YYYY-MM-DD HH:mm"
                          showTime={{
                            format: "HH:mm",
                          }}
                          allowClear="false"
                          defaultValue={
                            step2.round5 > 0
                              ? dayjs.utc(dayjs.unix(step2.round5))
                              : dayjs.utc()
                          }
                          onChange={(value, date) => {
                            setStep2(prevState => {
                              return {
                                ...prevState,
                                round5: moment.utc(date).unix(),
                              }
                            })
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="white1">
                        <Form.Label>Whitelist Round 1 *</Form.Label>
                        <Form.Control
                          as="textarea"
                          defaultValue={white1}
                          placeholder="enter address here, separated by comma (,)"
                          onChange={evt => setWhite1(evt.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="white2">
                        <Form.Label>Whitelist Round 2 *</Form.Label>
                        <Form.Control
                          as="textarea"
                          defaultValue={white2}
                          placeholder="enter address here, separated by comma (,)"
                          onChange={evt => setWhite2(evt.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="white2">
                        <Form.Label>Whitelist Round 3 *</Form.Label>
                        <Form.Control
                          as="textarea"
                          defaultValue={white3}
                          placeholder="enter address here, separated by comma (,)"
                          onChange={evt => setWhite3(evt.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="white2">
                        <Form.Label>Whitelist Round 4 *</Form.Label>
                        <Form.Control
                          as="textarea"
                          defaultValue={white4}
                          placeholder="enter address here, separated by comma (,)"
                          onChange={evt => setWhite4(evt.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="white5">
                        <Form.Label>Whitelist Round 5 *</Form.Label>
                        <Form.Control
                          as="textarea"
                          defaultValue={white5}
                          placeholder="enter address here, separated by comma (,)"
                          onChange={evt => setWhite5(evt.target.value)}
                        />
                      </Form.Group>
                    </Row>
                  </>
                )}

                <div className="d-flex justify-content-between mt-5">
                  <button
                    className="btn btn-primary px-3 fw-bolder"
                    onClick={handleBackButton}
                  >
                    {"<<"} Prev
                  </button>

                  <button
                    className="btn btn-primary px-3 fw-bolder"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
              </Form>
            )}
            {/* FORM 3 */}
            {activeTab === 3 && (
              <Form onSubmit={handleSubmit3}>
                <Row>
                  <Form.Group className="mb-2" as={Col} md={6} controlId="logo">
                    <Form.Label>Logo URL (80x80) *</Form.Label>
                    <Form.Control
                      defaultValue={step3?.logo}
                      placeholder="Ex. http://..."
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="website"
                  >
                    <Form.Label>Website *</Form.Label>
                    <Form.Control
                      defaultValue={step3?.website}
                      placeholder="Ex. http://..."
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="facebook"
                  >
                    <Form.Label>Facebook</Form.Label>
                    <Form.Control
                      defaultValue={step3?.facebook}
                      placeholder="Ex. http://..."
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="twitter"
                  >
                    <Form.Label>Twitter</Form.Label>
                    <Form.Control
                      defaultValue={step3?.twitter}
                      placeholder="Ex. http://..."
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="github"
                  >
                    <Form.Label>Github</Form.Label>
                    <Form.Control
                      defaultValue={step3?.github}
                      placeholder="Ex. http://..."
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="telegram"
                  >
                    <Form.Label>Telegram</Form.Label>
                    <Form.Control
                      defaultValue={step3?.telegram}
                      placeholder="Ex. http://..."
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="instagram"
                  >
                    <Form.Label>Instagram</Form.Label>
                    <Form.Control
                      defaultValue={step3?.instagram}
                      placeholder="Ex. http://..."
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="discord"
                  >
                    <Form.Label>Discord</Form.Label>
                    <Form.Control
                      defaultValue={step3?.discord}
                      placeholder="Ex. http://..."
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="reddit"
                  >
                    <Form.Label>Reddit</Form.Label>
                    <Form.Control
                      defaultValue={step3?.reddit}
                      placeholder="Ex. http://..."
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="youtube"
                  >
                    <Form.Label>Youtube</Form.Label>
                    <Form.Control
                      defaultValue={step3?.youtube}
                      placeholder="Ex. http://..."
                    />
                  </Form.Group>
                </Row>

                <div className="d-flex justify-content-between mt-5">
                  <button
                    className="btn btn-primary px-3 fw-bolder"
                    onClick={() => setActiveTab(activeTab - 1)}
                  >
                    {"<<"} Prev
                  </button>

                  <button
                    className="btn btn-primary px-3 fw-bolder"
                    type="submit"
                  >
                    Next {">>"}
                  </button>
                </div>
              </Form>
            )}
            {/* FoRM 4 */}
            {activeTab === 4 && (
              <Form onSubmit={handleSubmitFinal}>
                <Form.Group className="mb-2" controlId="desc">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Ex. This is the best project..."
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between mt-5">
                  <button
                    className="btn btn-primary px-3 fw-bolder"
                    onClick={handleBackButton}
                  >
                    {"<<"} Prev
                  </button>

                  <button
                    className="btn btn-primary px-3 fw-bolder"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
              </Form>
            )}
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ProjectSetup
