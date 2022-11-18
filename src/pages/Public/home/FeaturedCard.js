import React from "react"
import PropTypes, { any } from "prop-types"
import { Col, Row } from "react-bootstrap"

const FeaturedCard = props => {
  const tempCard = <div className="featured-card-animation"></div>
  const tempList = [tempCard, tempCard, tempCard, tempCard, tempCard]
  return (
    <div className="pt-4">
      <p className="text-center display-4 text-primary fw-bolder">
        Featured Projects
      </p>

      <div
        className="bg-white py-1 rounded mx-auto"
        style={{ maxWidth: 70 }}
      ></div>

      <Row className="my-4 justify-content-center flex-md-nowrap">
        {props.featuredSales.length > 0
          ? props.featuredSales.map((sale, key) => (
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
  )
}

FeaturedCard.propTypes = {
  featuredSales: any,
}

export default FeaturedCard
