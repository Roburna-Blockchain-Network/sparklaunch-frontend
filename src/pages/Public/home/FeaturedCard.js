import { API_URL, CHAIN_NUMBER } from "constants/Address"
import React, { useState, useEffect } from "react"
import { Col, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import OwlCarousel from "react-owl-carousel"
const FeaturedCard = () => {
  const tempCard = (
    <div
      className="featured-card"
      style={{
        backgroundImage: `url(https://res.cloudinary.com/dk8epvq9b/image/upload/v1664360000/cld-sample-4.jpg)`,
      }}
    ></div>
  )
  const tempList = [tempCard, tempCard, tempCard, tempCard, tempCard]
  const [featured, setFeatured] = useState([])

  useEffect(async () => {
    const abortController = new AbortController()
    try {
      const response = await fetch(`${API_URL}featured/${CHAIN_NUMBER}`, {
        signal: abortController.signal,
      })

      const res = await response.json()
      if (res.length < 1) {
        return
      }
      setFeatured(res)
      //  // console.log(res)
    } catch (error) {
      // console.log(error)
    }

    return () => {
      abortController.abort()
    }
  }, [])

  return (
    <div className="pt-4">
      <p className="text-center display-4 text-primary fw-bolder">
        Featured Projects
      </p>

      <div
        className="bg-white py-1 rounded mx-auto mb-4"
        style={{ maxWidth: 70 }}
      ></div>

      <OwlCarousel
        className="owl-theme"
        loop
        margin={25}
        nav
        responsive={{
          0: {
            items: 1,
            nav: true,
          },
          600: {
            items: 3,
            nav: false,
          },
          1000: {
            items: 5,
            nav: false,
            margin: 20,
          },
        }}
      >
        {featured.length > 0
          ? featured.map((sale, key) => (
              <div className="item" key={key}>
                <Link to={"sale/" + sale.id}>
                  <div
                    className="featured-card"
                    style={{
                      backgroundImage: `url(${sale.featuredImage})`,
                    }}
                  ></div>
                  <h3 className="text-center mt-1 d-none d-lg-block">
                    {sale.tokenName ? sale.tokenName : ""}
                  </h3>
                  <h5 className="text-center mt-1 d-lg-none">
                    {sale.tokenName ? sale.tokenName : ""}
                  </h5>
                </Link>
              </div>
            ))
          : tempList.map((item, key) => (
              <div className="item" key={key}>
                {item}
              </div>
            ))}
      </OwlCarousel>
    </div>
  )
}

export default FeaturedCard
