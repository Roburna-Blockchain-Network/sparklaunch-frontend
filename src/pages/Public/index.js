import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import { Link } from "react-router-dom"

import { Col, Container, Row } from "react-bootstrap"
import { fetchAllSales } from "connect/dataProccessing"
import SaleCard from "components/SaleCard"
import smLogo from "assets/images/logos/smlogo.png"
import api from "connect/BaseApi"
import Hero from "./home/Hero"
import FeaturedCard from "./home/FeaturedCard"
import useDeployedSales from "hooks/useDeployedSales"
import { useDispatch, useSelector } from "react-redux"
import { setInitialSales, setSaleDeployed } from "store/actions"
import { BigNumber } from "ethers"
import { useEthers } from "@usedapp/core"

const Public = props => {
  const dispatch = useDispatch()
  const { isLogin, selectedChain } = useSelector(state => state.User)
  const { sales } = useSelector(state => state.User)

  const [featuredSales, setFeaturedSales] = useState([])
  const [deployedSales, setDeployedSales] = useState([])
  const [filteredSales, setFilteredSales] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBtn, setSelectedBtn] = useState("ALL")

  const allSales = useDeployedSales()

  useEffect(() => {
    if (allSales instanceof BigNumber) {
      dispatch(setSaleDeployed(allSales.toNumber()))
    }
  }, [])

  const contains = (item, searchValue) => {
    if (searchValue === null || searchValue.trim() === "") {
      return true
    }

    const saleDetails = JSON.stringify(Object.values(item.saleDetails))
    const saleToken = Object.values(item.saleToken)
      .toString()
      .toLocaleLowerCase()

    if (
      saleDetails.includes(searchValue.toLocaleLowerCase()) ||
      saleToken.includes(searchValue.toLocaleLowerCase())
    ) {
      return true
    }

    return false
  }

  const handleBtnFilter = term => {
    setSearchTerm("")
    setSelectedBtn(term)

    if (term === "ALL") {
      setFilteredSales(deployedSales)
      return
    }

    if (typeof deployedSales == "undefined") {
      return
    }
    if (deployedSales.length <= 0) {
      return
    }

    setFilteredSales(
      deployedSales.filter(item => {
        if (
          item.saleDetails.status.toLocaleLowerCase() ===
          term.toLocaleLowerCase()
        ) {
          return item
        }
      })
    )
  }

  const fetchFeaturedSale = () => {
    api
      .get("featured/true", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
      .then(response => {
        const data = response.data
        setFeaturedSales(data)
      })
      .catch(error => {
        console.log(error.response?.data?.message)
      })
  }

  useEffect(async () => {
    const sales = await fetchAllSales(selectedChain)
    dispatch(setInitialSales(sales))
    setDeployedSales(sales)
    setFilteredSales(sales)
    setIsLoading(false)
  }, [selectedChain])

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Home | SparkLaunch</title>
        </MetaTags>

        <Container fluid>
          <Hero />
          <FeaturedCard featuredSales />

          <div className="my-4">
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
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="g-4 my-4" id="pools">
                  {filteredSales?.length > 0 ? (
                    filteredSales
                      ?.filter(item => {
                        return contains(item, searchTerm)
                      })
                      .map((sale, key) => (
                        <Col key={key} lg={3} md={4} sm={6}>
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
                  <button className="btn btn-lg bg-primary rounded-4 w-25 fs-1 fw-bold text-black me-3">
                    Ask Us
                  </button>
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
