import React, { useState, useEffect } from "react"
import { MetaTags } from "react-meta-tags"
import moment from "moment"
import { useContractFunction, useEthers, useToken } from "@usedapp/core"
import { Contract } from "@ethersproject/contracts"

import { Col, Container, Form, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"

import { ethers, utils } from "ethers"
import useDeploymentFee from "hooks/useDeploymentFee"

import {
  FACTORY_ADDRESS,
  API_URL,
  ROUTER_ADDRESS,
  ADMIN_ADDRESS,
} from "constants/Address"

import FactoryAbi from "constants/abi/Factory.json"
import ERCAbi from "constants/abi/ERC20.json"
import { saveData } from "connect/dataProccessing"

const ProjectSetup = () => {
  const { account, chainId, library } = useEthers()
  const deployFee = useDeploymentFee()
  const [activeTab, setActiveTab] = useState(1)
  const [step1, setStep1] = useState(null)

  const [step2, setStep2] = useState(null)
  const [isAble, setIsAble] = useState(false)

  const [step3, setStep3] = useState(null)
  const [description, setDescription] = useState("")
  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    decimal: "",
    symbol: "",
  })
  const [isValidStep1, setIsValidStep1] = useState(false)
  const [displayInfo, setDisplayInfo] = useState(false)

  const [deploymentFee, setDeploymentFee] = useState(0.0)

  const [isLoading, setIsLoading] = useState(false)
  const [isPrivateSale, setIsPrivateSale] = useState(false)
  const [saleType, setSaleType] = useState("public")

  const handleSubmit1 = async event => {
    const form = event.currentTarget

    event.preventDefault()
    event.stopPropagation()

    const isAlreadyApprove = await handleBeforeSubmit({
      address: form.address.value,
    })

    if (isAlreadyApprove) {
      setStep1({
        title: form.title.value,
        // symbol: form.symbol.value,
        address: form.address.value,
        price: form.price.value,
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

  const handleSubmit2 = event => {
    const form = event.currentTarget

    event.preventDefault()
    event.stopPropagation()

    if (saleType === "public") {
      setStep2({
        softcap: form.softcap.value,
        hardcap: form.hardcap.value,
        minbuy: form.minbuy.value,
        maxbuy: form.maxbuy.value,
        startdt: form.startdt.value,
        enddt: form.enddt.value,
        publicDate: form.publicDate.value,
        listingPrice: form.listingPrice.value,
        liquidityPercent: form.liquidityPercent.value,
        liquidityLock: form.liquidityLock.value,
        // round1: form.round1.value,
        // round2: form.round2.value,
        // round3: form.round3.value,
        // round4: form.round4.value,
        // round5: form.round5.value,
      })
    } else {
      setStep2({
        selectedSaleType: saleType,
        softcap: form.softcap.value,
        hardcap: form.hardcap.value,
        minbuy: form.minbuy.value,
        maxbuy: form.maxbuy.value,
        startdt: form.startdt.value,
        enddt: form.enddt.value,
        publicDate: form.publicDate.value,
        listingPrice: form.listingPrice.value,
        liquidityPercent: form.liquidityPercent.value,
        liquidityLock: form.liquidityLock.value,
        round1: form.round1.value,
        round2: form.round2.value,
        round3: form.round3.value,
        round4: form.round4.value,
        round5: form.round5.value,
      })
    }
    setActiveTab(activeTab + 1)
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
    console.log(data)
    const factoryContractAddress = FACTORY_ADDRESS[chainId]
    const contract = new Contract(
      factoryContractAddress,
      FactoryAbi,
      library.getSigner()
    )
    const routerAddress = ROUTER_ADDRESS[chainId]
    const adminAddress = ADMIN_ADDRESS[chainId]
    // const se
    const START_SALE = moment(data.startdt).unix()
    const END_SALE = moment(data.enddt).unix()
    const PUBLIC_SALE = moment(data.publicDate).unix()
    const PUBLIC_DELTA = END_SALE - (PUBLIC_SALE + 10)
    let startTimes = []
    let isPublic = "false"

    if (typeof data.round1 == "undefined") {
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
          "1000",
          utils.parseEther(data.minbuy),
          utils.parseEther(data.maxbuy),
          data.liquidityPercent * 100,
          utils.parseEther(data.listingPrice),
          data.liquidityLock * 60,
          utils.parseEther(data.price),
          END_SALE,
          START_SALE,
          PUBLIC_DELTA,
          utils.parseEther(data.hardcap),
          utils.parseEther(data.softcap),
        ],
        [adminAddress],
        [1],
        startTimes,
        isPublic,
        { value: utils.parseEther(deploymentFee) }
      )
      await tx.wait()

      const deployedAddress = await contract.saleIdToAddress(saleId.toNumber())

      return [saleId.toNumber(), deployedAddress]
    } catch (error) {
      console.log(error)
    }
  }
  const handleBeforeSubmit = async data => {
    const factoryContractAddress = FACTORY_ADDRESS[chainId]
    const contract = new Contract(data.address, ERCAbi, library.getSigner())

    try {
      await contract.approve(
        factoryContractAddress,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      )
      return true
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmitFinal = async event => {
    event.preventDefault()
    event.stopPropagation()
    setIsLoading(true)
    const values = {
      title: step1?.title,
      price: step1?.price,
      address: step1?.address,

      softcap: step2?.softcap,
      hardcap: step2?.hardcap,
      minbuy: step2?.minbuy,
      maxbuy: step2?.maxbuy,
      startdt: step2?.startdt,
      enddt: step2?.enddt,
      round1: step2?.round1,
      round2: step2?.round2,
      round3: step2?.round3,
      round4: step2?.round4,
      round5: step2?.round5,
      listingPrice: step2?.listingPrice,
      liquidityPercent: step2?.liquidityPercent,
      liquidityLock: step2?.liquidityLock,
      publicDate: step2?.publicDate,
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
    try {
      // const [id, contractAddress] = await handleDeploySale(values)
      values.id = 7
      values.address = "0x08c65eB92d15Aafc5c0e07B60659BbDE59c26051"
      // console.log(id)
      const dbId = await saveData(values)

      console.log(dbId)
    } catch (error) {
      console.log(error)
    }
  }

  const addressValidation = async e => {
    const inputtedAddress = e.target.value
    setDisplayInfo(false)
    setIsValidStep1(false)
    const response = await fetch(
      `${API_URL}check/${chainId}/${inputtedAddress}`
    )
    const data = await response.json()
    if (data.success === false) {
      e.target.focus()
      return
    }

    setTokenInfo({
      name: data.data.name,
      symbol: data.data.symbol,
      decimal: data.data.decimal,
    })
    setDisplayInfo(true)
    setIsValidStep1(true)
  }

  const handleSaletype = e => {
    const selectedType = e.target.value
    setSaleType(selectedType)
  }

  // useEffect(() => {

  // }, [tokenInfo, inputAddress])

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
                    onBlur={addressValidation}
                  />
                  <Form.Text className="text-primary">
                    Pool creation fee: {deploymentFee} BNB
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
                    label="BNB"
                    required
                  />
                  <Form.Text className="text-primary">
                    Users will pay with BNB for your token
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-2" as={Col} controlId="price">
                  <Form.Label>Token Price (BNB) *</Form.Label>
                  <Form.Control
                    defaultValue={step1?.price}
                    type="number"
                    placeholder="0"
                    step=".0000001"
                    min="0"
                    required
                  />
                  <p className="form-text text-info">
                    If I want to buy 1 Token how many BNB Should I spend?
                  </p>
                </Form.Group>

                <div className="text-end">
                  <button
                    disabled={!isValidStep1}
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
                    <Form.Label>SoftCap (any)</Form.Label>
                    <Form.Control
                      defaultValue={step2?.softcap}
                      type="number"
                      placeholder="0"
                      step=".0000001"
                      min="0"
                    />
                    {/* <p className="form-text text-info">
                      Softcap must be >= 50% of Hardcap!
                    </p> */}
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="hardcap"
                  >
                    <Form.Label>Hardcap (any) *</Form.Label>
                    <Form.Control
                      defaultValue={step2?.hardcap}
                      type="number"
                      placeholder="0"
                      step=".0000001"
                      min="0"
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="minbuy"
                  >
                    <Form.Label>Minimum Buy(BNB) *</Form.Label>
                    <Form.Control
                      defaultValue={step2?.minbuy}
                      type="number"
                      placeholder="0"
                      step=".0000001"
                      min="0"
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="maxbuy"
                  >
                    <Form.Label>Maximum Buy(BNB) *</Form.Label>
                    <Form.Control
                      defaultValue={step2?.maxbuy}
                      type="number"
                      placeholder="0"
                      step=".0000001"
                      min="0"
                      required
                    />
                  </Form.Group>

                  <p className="form-text text-primary mb-2">
                    Select time & end time (UTC) *
                  </p>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="startdt"
                  >
                    <Form.Label>Start time (UTC) *</Form.Label>
                    <Form.Control
                      defaultValue={step2?.startdt}
                      type="datetime-local"
                      placeholder="0"
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="enddt"
                  >
                    <Form.Label>End time (UTC) *</Form.Label>
                    <Form.Control
                      defaultValue={step2?.enddt}
                      type="datetime-local"
                      placeholder="0"
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="publicDate"
                  >
                    <Form.Label>Public Round Start Date *</Form.Label>
                    <Form.Control
                      defaultValue={step2?.publicDate}
                      type="datetime-local"
                      placeholder="0"
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="listingPrice"
                  >
                    <Form.Label>Listing Price *</Form.Label>
                    <Form.Control
                      defaultValue={step2?.listingPrice}
                      type="number"
                      required
                      // min="60"
                      // max="100"
                      // placeholder="51"
                      step="0.1"
                    />
                    {/* <p className="form-text text-primary">
                      Leave blank if you are the sale owner
                    </p> */}
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
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    controlId="liquidityLock"
                  >
                    <Form.Label>Liquidity Lock (minutes)</Form.Label>
                    <Form.Control
                      defaultValue={step2?.liquidityLock}
                      type="number"
                      min="5"
                      placeholder="5"
                      step="1"
                      required
                    />
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
                        onChange={handleSaletype}
                        checked={saleType === "public"}
                      />
                      <label className="form-check-label" for="saleType1">
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
                        onChange={handleSaletype}
                        checked={saleType == "private"}
                      />
                      <label className="form-check-label" for="saleType2">
                        Private
                      </label>
                    </div>
                  </div>
                </Row>
                {saleType == "private" && (
                  <>
                    <p className="mb-3 mt-3 fs-5">Set Sale Rounds</p>
                    <Row>
                      <Form.Text className="text-primary mb-2">
                        Enter Hrs after sale start that a round should begin
                      </Form.Text>
                      <Form.Group
                        className="mb-2"
                        as={Col}
                        md={6}
                        lg={4}
                        controlId="round1"
                      >
                        <Form.Label>Rounds 1 </Form.Label>
                        <Form.Control
                          defaultValue={step2?.round1}
                          type="datetime-local"
                          required
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-2"
                        as={Col}
                        md={6}
                        lg={4}
                        controlId="round2"
                      >
                        <Form.Label>Round 2 (Hrs) *</Form.Label>
                        <Form.Control
                          defaultValue={step2?.round2}
                          type="datetime-local"
                          required
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-2"
                        as={Col}
                        md={6}
                        lg={4}
                        controlId="round3"
                      >
                        <Form.Label>Round 3 (Hrs) *</Form.Label>
                        <Form.Control
                          defaultValue={step2?.round3}
                          type="datetime-local"
                          required
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
                        <Form.Control
                          defaultValue={step2?.round4}
                          type="datetime-local"
                          required
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
                        <Form.Control
                          defaultValue={step2?.round5}
                          type="datetime-local"
                          required
                        />
                      </Form.Group>

                      {/* <Form.Group
                    className="mb-2"
                    as={Col}
                    md={6}
                    lg={4}
                    controlId="publicRound"
                  >
                    <Form.Label>Public Round (Hrs) *</Form.Label>
                    <Form.Control
                      defaultValue={step2?.publicRound}
                      type="datetime-local"
                      required
                    />
                  </Form.Group> */}
                    </Row>
                  </>
                )}
                {/* <p className="form-text mb-3 fs-5">Set Sale Whitelist</p> */}
                {/* <Row>
                  <Form.Group className="" as={Col} md={6} controlId="csvlink">
                    <Form.Label>CSV File Link </Form.Label>
                    <Form.Control
                      defaultValue={step2?.csvlink}
                      placeholder="Ex. https://bit.ly/3yW3ieR"
                    />
                  </Form.Group>
                  <Form.Group className="mt-4 fs-5" as={Col} md={6}>
                    <Form.Text>
                      <a
                        href="https://bit.ly/3yW3ieR"
                        target="_blank"
                        className="text-"
                      >
                        see example.
                      </a>
                    </Form.Text>
                  </Form.Group>
                </Row> */}

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
