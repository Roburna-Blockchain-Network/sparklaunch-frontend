import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { Col, Container, Row } from "react-bootstrap"
import { fetchAllSales } from "connect/dataProccessing"
import SaleCard from "components/SaleCard"
import smLogo from "assets/images/logos/smlogo.png"
import api from "connect/BaseApi"
import Hero from "./home/Hero"
import FeaturedCard from "./home/FeaturedCard"
import { useDispatch, useSelector } from "react-redux"
import { setInitialSales, setSaleDeployed } from "store/actions"
import { BigNumber } from "ethers"
import { useEthers } from "@usedapp/core"
import { getRoundInfo, getSaleInfo, getTokenInfo } from "utils/factoryHelper"
import { CHAIN_NUMBER } from "constants/Address"

const currentDate = dayjs.utc().unix()

const Public = props => {
  const dispatch = useDispatch()
  const allSales = useSelector(state => state.Sales)

  const { chainId, account } = useEthers()

  const [filtered, setFiltered] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBtn, setSelectedBtn] = useState("ALL")

  const contains = (item, searchValue) => {
    // console.log(currentDate)
    if (
      searchValue === null ||
      searchValue.trim() === "" ||
      searchValue === "ALL"
    ) {
      return true
    }

    if (searchValue === "UPCOMMING") {
      return item.round.start > currentDate
    }

    if (searchValue === "ENDED") {
      return item.round.end < currentDate
    }

    if (searchValue === "CLOSED") {
      return item.isFinished
    }

    if (searchValue === "LIVE") {
      return item.round.end > currentDate && item.round.start < currentDate
    }

    return (
      item.address
        .toLocaleLowerCase()
        .includes(searchValue.toLocaleLowerCase()) ||
      item.description
        .toLocaleLowerCase()
        .includes(searchValue.toLocaleLowerCase()) ||
      item.token.name
        .toLocaleLowerCase()
        .includes(searchValue.toLocaleLowerCase()) ||
      item.token.symbol
        .toLocaleLowerCase()
        .includes(searchValue.toLocaleLowerCase())
    )

    // return true

    // const saleDetails = JSON.stringify(Object.values(item.saleDetails))
    // const saleToken = Object.values(item.saleToken)
    //   .toString()
    //   .toLocaleLowerCase()

    // if (
    //   saleDetails.includes(searchValue.toLocaleLowerCase()) ||
    //   saleToken.includes(searchValue.toLocaleLowerCase())
    // ) {
    //   return true
    // }

    // return false
  }

  const handleBtnFilter = term => {
    setSearchTerm("")
    setSelectedBtn(term)
    setFiltered(term)
  }

  useEffect(async () => {
    console.log(`effect run`)
    console.log(allSales)
    setIsLoading(true)
    if (!allSales.isInit) {
      try {
        const sales = await fetchAllSales(CHAIN_NUMBER)
        for (const sale of sales) {
          const [token, round, info] = await Promise.all([
            getTokenInfo(sale.tokenAddress),
            getRoundInfo(sale.address),
            getSaleInfo(sale.address),
          ])

          if (info.success && token.success && round.success) {
            sale.info = info?.data
            sale.token = token?.data
            sale.round = round?.data
          } else {
            setIsLoading(true)
            return
          }
        }
        dispatch(setInitialSales(sales))
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    setIsLoading(false)
  }, [dispatch])

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Home | SparkLaunch</title>
        </MetaTags>

        <Container fluid>
          <Hero />
          <FeaturedCard />

          <div className="my-4" id="pools">
            {isLoading ? (
              <div className="text-center mt-4">
                <img src={smLogo} className="blinking-item" height={150} />
              </div>
            ) : (
              <>
                <Row id="sales" className="py-4">
                  <Col
                    lg={8}
                    className="d-flex justify-content-md-evenly mb-3 mb-lg-0 pb-1 overflow-auto fancy-scroll-x"
                  >
                    <button
                      className={`btn filter-button ${
                        selectedBtn === "ALL" ? "selected" : ""
                      }`}
                      onClick={() => handleBtnFilter("ALL")}
                    >
                      ALL SALES
                    </button>

                    <button
                      className={`btn filter-button ${
                        selectedBtn === "UPCOMMING" ? "selected" : ""
                      }`}
                      onClick={() => handleBtnFilter("UPCOMMING")}
                    >
                      UPCOMING
                    </button>

                    <button
                      className={`btn filter-button ${
                        selectedBtn === "LIVE" ? "selected" : ""
                      }`}
                      onClick={() => handleBtnFilter("LIVE")}
                    >
                      LIVE
                    </button>

                    <button
                      className={`btn filter-button ${
                        selectedBtn === "ENDED" ? "selected" : ""
                      }`}
                      onClick={() => handleBtnFilter("ENDED")}
                    >
                      ENDED
                    </button>

                    <button
                      className={`btn filter-button ${
                        selectedBtn === "CLOSED" ? "selected" : ""
                      }`}
                      onClick={() => handleBtnFilter("CLOSED")}
                    >
                      CLOSED
                    </button>
                  </Col>

                  <Col
                    xs={{ span: 10, offset: 1 }}
                    md={{ span: 8, offset: 2 }}
                    lg={{ span: 4, offset: 0 }}
                  >
                    <div className="filter-search-name mt-3 mt-lg-0">
                      <i className="bx bx-search fs-1 me-1" />
                      <input
                        className="search-input"
                        type="search"
                        placeholder="Search.."
                        aria-label="Search"
                        defaultValue={searchTerm}
                        onChange={e => setFiltered(e.target.value)}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="g-4 my-4">
                  {allSales.sales?.length > 0 ? (
                    allSales.sales
                      ?.filter(item => {
                        return contains(item, filtered)
                      })
                      .map((sale, key) => (
                        <Col key={key} lg={4} md={4} sm={6}>
                          <SaleCard sale={sale} />
                        </Col>
                      ))
                  ) : (
                    <div className="text-center display-1 text-primary fw-bold">
                      No Sales Found
                    </div>
                  )}
                </Row>

                <div className="text-end mb-3">
                  <a
                    href="mailto:contact@ignite-defi.com"
                    className="btn btn-lg bg-primary rounded-4 w-25 fs-1 fw-bold text-black me-3"
                  >
                    Contact Us
                  </a>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Public
