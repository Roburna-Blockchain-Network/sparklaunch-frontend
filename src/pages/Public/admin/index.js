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
dayjs.extend(utc)
const ProjectSetup = () => {
  let history = useHistory()
  const { account, chainId, library, activateBrowserWallet } = useEthers()

  const deployFee = getUseDeploymentFee()
  const servicesFee = getUseServiceFee()

  const user = useSelector(state => state.User)

  const [activeTab, setActiveTab] = useState(1)
  const [step1, setStep1] = useState(null)

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
    const feeVal = ethers.utils.formatEther(deployFee)
    setDeploymentFee(feeVal)
  }, [deployFee])

  useEffect(async () => {
    const feeVal = ethers.utils.formatUnits(servicesFee, "4")
    setServiceFee(feeVal * 100)
  }, [servicesFee])

  const validateStep2 = async () => {
    /**
     * check initial
     */

    if (
      step2.softCap == 0 ||
      step2.hardCap == 0 ||
      step2.minBuy == 0 ||
      step2.maxBuy == 0 ||
      step2.presaleRate == 0 ||
      step2.listingRate == 0 ||
      step2.startTime == 0 ||
      step2.endTime == 0 ||
      step2.publicTime == 0 ||
      step2.liquidityPercent == 0 ||
      step2.liquidityLock == 0
    ) {
      return false
    }

    if (!step2.isPublic) {
      if (
        step2.round1 == 0 ||
        step2.round2 == 0 ||
        step2.round3 == 0 ||
        step2.round4 == 0 ||
        step2.round5 == 0
      ) {
        return false
      }
    }

    if (step2.minBuy > step2.maxBuy) {
      return false
    }

    if (step2.startTime > step2.endTime) {
      return false
    }

    if (step2.startTime > step2.publicTime) {
      return false
    }

    if (step2.publicTime > step2.endTime) {
      return false
    }

    if (!step2.isPublic) {
      if (step2.round1 > step2.round2) {
        return false
      }
      if (step2.round2 > step2.round3) {
        return false
      }
      if (step2.round3 > step2.round4) {
        return false
      }
      if (step2.round4 > step2.round5) {
        return false
      }
      if (step2.round5 > step2.publicTime) {
        return false
      }
    }

    if (BigNumber.from(userAllow).lt(BigNumber.from(requiredToken))) {
      const res = await handleBeforeSubmit(requiredToken)
    }
    const userBalance = await handleCheckBalance()

    if (!userBalance) {
      return false
    }
    // console.log(`sukses`)
    return true
  }

  const handleSubmit2 = async event => {
    const form = event.currentTarget

    event.preventDefault()
    event.stopPropagation()
    // console.log(step2)

    const isValid = await validateStep2()

    if (isValid) {
      setActiveTab(activeTab + 1)
    }
    //  // console.log(step2data)
  }

  const handleSubmit3 = event => {
    const form = event.currentTarget

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

  const handleDeploySale = async data => {
    // console.log(data)
    const factoryContractAddress = FACTORY_ADDRESS[chainId]
    const contract = new Contract(
      factoryContractAddress,
      FactoryAbi,
      library.getSigner()
    )
    const routerAddress = ROUTER_ADDRESS[chainId]
    const adminAddress = ADMIN_ADDRESS[chainId]
    // const se
    const START_SALE = data.startdt
    const END_SALE = data.enddt
    const PUBLIC_SALE = data.publicDate
    // const PUBLIC_DELTA = END_SALE - (PUBLIC_SALE + 10)
    const PUBLIC_DELTA = 10
    let startTimes = []
    let isPublic = "false"

    if (step2.isPublic) {
      startTimes.push(START_SALE + 1)
      startTimes.push(START_SALE + 2)
      startTimes.push(START_SALE + 3)
      startTimes.push(START_SALE + 4)
      startTimes.push(START_SALE + 5)
      isPublic = "true"
    } else {
      // data.round1 = moment(data.enddt).unix()
      startTimes.push(moment(data.round1).unix())
      startTimes.push(moment(data.round2).unix())
      startTimes.push(moment(data.round3).unix())
      startTimes.push(moment(data.round4).unix())
      startTimes.push(moment(data.round5).unix())
    }
    try {
      const saleId = await contract.getNumberOfSalesDeployed()
      const tx = await contract.deployNormalSale(
        [routerAddress, adminAddress, data.address, account],
        [
          "1000", // TODO : need change
          data.minbuy,
          data.maxbuy,
          data.liquidityPercent,
          data.listingPrice,
          data.liquidityLock,
          data.price,
          END_SALE,
          START_SALE,
          PUBLIC_DELTA,
          data.hardcap,
          data.softcap,
        ],
        [adminAddress],
        [1],
        startTimes,
        isPublic,
        { value: utils.parseEther(deploymentFee) }
      )
      await tx.wait()

      const deployedAddress = await contract.saleIdToAddress(saleId.toNumber())
      // console.log(deployedAddress)

      return [saleId.toNumber(), deployedAddress]
    } catch (error) {
      // console.log(error)
    }
  }

  const handleBeforeSubmit = async data => {
    const factoryContractAddress = FACTORY_ADDRESS[chainId]
    const contract = new Contract(
      tokenInfo.address,
      ERCAbi,
      library.getSigner()
    )
    const amount = parseUnits(requiredToken, BigNumber.from(tokenInfo.decimal))
    try {
      const approval = await contract.approve(factoryContractAddress, amount)

      await approval.wait()

      return true
    } catch (error) {
      // console.log(error)
    }
  }

  const handleCheckBalance = async data => {
    const factoryContractAddress = FACTORY_ADDRESS[chainId]
    const contract = new Contract(
      tokenInfo.address,
      ERCAbi,
      library.getSigner()
    )

    try {
      const userbal = await contract.balanceOf(account)

      if (userbal.gt(BigNumber.from(requiredToken))) return true

      return false
    } catch (error) {
      // console.log(error)
    }
  }

  const handleSubmitFinal = async event => {
    event.preventDefault()
    event.stopPropagation()
    setIsLoading(true)

    const DIVISION_BASE = 10000

    const presaleRatePrice = tokenRate(step2.presaleRate, tokenInfo.decimal)
    const tokenSoftCap = step2.presaleRate * step2.softCap
    const tokenHardCap = step2.presaleRate * step2.hardCap

    const _minBuy = step2.minBuy * DIVISION_BASE
    const _maxBuy = step2.maxBuy * DIVISION_BASE
    //  // console.log(step2)
    const values = {
      title: step1?.title,
      price: presaleRatePrice.toString(),
      address: tokenInfo.address,
      softcap: parseUnits(tokenSoftCap.toString(), tokenInfo.decimal * 1),
      hardcap: parseUnits(tokenHardCap.toString(), tokenInfo.decimal * 1),
      maxbuy: parseEther(_maxBuy.toString())
        .div(BigNumber.from(DIVISION_BASE))
        .toString(),
      minbuy: parseEther(_minBuy.toString())
        .div(BigNumber.from(DIVISION_BASE))
        .toString(),
      startdt: step2?.startTime,
      enddt: step2?.endTime,
      round1: step2?.round1,
      round2: step2?.round2,
      round3: step2?.round3,
      round4: step2?.round4,
      round5: step2?.round5,
      listingPrice: parseUnits(step2.listingRate.toString(), tokenInfo.decimal),
      liquidityPercent: (step2.liquidityPercent * 100).toString(),
      liquidityLock: (step2?.liquidityLock * 86400).toString(),
      publicDate: step2?.publicTime,
      saleOwner: account,
      whilelist: step2?.csvlink,

      logo: step3?.logo,
      website: step3?.website,
      facebook: step3?.facebook,
      twitter: step3?.twitter,
      github: step3?.github,
      telegram: step3?.telegram,
      instagram: step3?.instagram,
      discord: step3?.discord,
      reddit: step3?.reddit,
      youtube: step3?.youtube,
      description: description,
    }
    //  // console.log(values)
    try {
      const [id, contractAddress] = await handleDeploySale(values)

      // console.log(id, contractAddress)
      values.id = id
      values.contractAddress = contractAddress
      values.chainId = chainId

      const dbId = await saveData(values)
      if (dbId) {
        setIsLoading(false)
        history.push(`/sale/${id}`)
      } else {
        // console.log(`backend error`)
      }
    } catch (error) {
      // console.log(error)
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
    })
    setDisplayInfo(true)
    setIsValidStep1(true)
  }

  useEffect(async () => {
    if (activeTab == 2 && account) {
      try {
        const allow = await getTokenAllowance(
          user.selectedChain,
          tokenInfo.address,
          account
        )
        if (allow.success) {
          setUserAllow(allow.data.allowance)
        }

        //  // console.log(allow)
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
      desc: "Input your awesome title, and choose the currency",
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

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Project Setup | SparkLaunch</title>
        </MetaTags>

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
                      step="1"
                      min="0"
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
                      step="1"
                      min={step2.softCap}
                      max={step2.softCap * 2}
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
                    <Form.Label>Maximum Buy(BNB) *</Form.Label>
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
                        Private
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
                    // disabled={!isValidStep2}
                  >
                    Next {">>"}
                  </button>
                </div>
              </Form>
            )}
            {/* FORM 3 */}
            {activeTab === 3 && (
              <Form onSubmit={handleSubmit3}>
                <Row>
                  <Form.Group className="mb-2" as={Col} md={6} controlId="logo">
                    <Form.Label>Logo URL *</Form.Label>
                    <Form.Control
                      defaultValue={step3?.logo}
                      placeholder="Ex. http://... (200x200)"
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
