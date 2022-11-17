import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import { Link } from "react-router-dom"

import { Col, Container, Row } from "react-bootstrap"

import { fetchAllSales } from "connect/dataProccessing"

import SaleCard from "components/SaleCard"
import verticaLogo from "assets/images/logos/biglogo.png"
import smLogo from "assets/images/logos/smlogo.png"
import api from "connect/BaseApi"

const Public = props => {
  const tempCard = <div className="featured-card-animation"></div>
  const tempList = [tempCard, tempCard, tempCard, tempCard, tempCard]

  const [featuredSales, setFeaturedSales] = useState([])
  const [deployedSales, setDeployedSales] = useState([])
  const [filteredSales, setFilteredSales] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBtn, setSelectedBtn] = useState("ALL")

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
        // console.log(data)

        setFeaturedSales(data)
      })
      .catch(error => {
        // information not found
        console.log(error.response?.data?.message)
      })
  }

  useEffect(async () => {
    fetchFeaturedSale()

    const sales = await fetchAllSales()

    setTimeout(() => {
      setDeployedSales(sales?.salesData)
      setFilteredSales(sales?.salesData)
      setIsLoading(false)
    }, 10000)
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Home | SparkLaunch</title>
        </MetaTags>

        <Container fluid>
          <Row className="mb-5">
            <Col md={{ span: 6, offset: 3 }} className="d-flex">
              <img className="img-fluid mx-auto mb-4" src={verticaLogo} />
            </Col>
          </Row>

          <Row className="pt-5 mb-lg-5 mb-3">
            <Col
              xs={12}
              md={6}
              className="text-lg-end text-center mb-5 mb-lg-0"
            >
              <Link
                to="/project-setup"
                className="bg-primary text-black fw-bold p-3 rounded-pill"
              >
                <span className="fs-4 d-none d-lg-inline">
                  LAUNCH YOUR PROJECT WITH US
                </span>
                <span className="fs-5 d-lg-none">
                  LAUNCH YOUR PROJECT WITH US
                </span>
              </Link>
            </Col>

            <Col md={6} className="text-center">
              <a
                href="#sales"
                className="border border-2 border-primary text-white fw-bold py-3 px-5 w-lg rounded-pill"
              >
                <span className="fs-4 d-none d-lg-inline">BUY $IGHT</span>
                <span className="fs-5 d-lg-none">BUY $IGHT</span>
              </a>
            </Col>
          </Row>

          <div className="pt-4">
            <p className="text-center display-4 text-primary fw-bolder">
              Featured Projects
            </p>

            <div
              className="bg-white py-1 rounded mx-auto"
              style={{ maxWidth: 70 }}
            ></div>

            <Row className="my-4 justify-content-center flex-md-nowrap">
              {featuredSales.length > 0
                ? featuredSales.map((sale, key) => (
                    <Col
                      xs={6}
                      sm={4}
                      md="2"
                      key={key}
                      className="mb-3 flex-md-grow-1"
                    >
                      <Link to={"sale/" + sale._id}>
                        <div
                          className="featured-card"
                          style={{
                            backgroundImage: `url(${sale.saleDetails.saleImg})`,
                          }}
                        ></div>
                        <h3 className="text-center mt-1 d-none d-lg-block">
                          {sale.saleToken.name}
                        </h3>
                        <h5 className="text-center mt-1 d-lg-none">
                          {sale.saleToken.name}
                        </h5>
                      </Link>
                    </Col>
                  ))
                : tempList.map((item, key) => <Col key={key}>{item}</Col>)}{" "}
            </Row>
          </div>

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
