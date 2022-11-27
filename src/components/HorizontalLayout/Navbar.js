import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { Collapse } from "react-bootstrap"
import { Link, withRouter } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"

// Redux Store
import { toggleLeftmenu } from "store/actions"

import { connect } from "react-redux"

const Navbar = props => {
  useEffect(() => {
    var matchingMenuItem = null
    var ul = document.getElementById("navigation")
    var items = ul.getElementsByTagName("a")
    for (var i = 0; i < items.length; ++i) {
      if (props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  })

  function activateParentDropdown(item) {
    //  // console.log(item)
    item.classList.add("active")
    const parent = item.parentElement
    if (parent) {
      parent.classList.add("active") // li
      const parent2 = parent.parentElement
      parent2.classList.add("active") // li
      const parent3 = parent2.parentElement
      if (parent3) {
        parent3.classList.add("active") // li
        const parent4 = parent3.parentElement
        if (parent4) {
          parent4.classList.add("active") // li
          const parent5 = parent4.parentElement
          if (parent5) {
            parent5.classList.add("active") // li
            const parent6 = parent5.parentElement
            if (parent6) {
              parent6.classList.add("active") // li
            }
          }
        }
      }
    }
    return false
  }

  return (
    <React.Fragment>
      <div className="topnav d-lg-none">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              in={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav align-items-start">
                <li className="nav-item">
                  <Link
                    to="/"
                    onClick={() => props.toggleLeftmenu(!props.leftMenu)}
                    className="nav-link arrow-none"
                  >
                    {/* <i className="bx bx-home-circle me-2" /> */}
                    {props.t("Home")} {props.menuOpen}
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/#pools"
                    onClick={() => props.toggleLeftmenu(!props.leftMenu)}
                    className="nav-link arrow-none"
                  >
                    {/* <i className="bx bx-home-circle me-2" /> */}
                    {props.t("Pools")} {props.menuOpen}
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="#"
                    onClick={() => props.toggleLeftmenu(!props.leftMenu)}
                    className="nav-link arrow-none"
                  >
                    {props.t("About")} {props.menuOpen}
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="#"
                    onClick={() => props.toggleLeftmenu(!props.leftMenu)}
                    className="nav-link arrow-none"
                  >
                    {props.t("Token Locker")} {props.menuOpen}
                  </Link>
                </li>
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  )
}

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout
  return { leftMenu }
}

export default withRouter(
  connect(mapStatetoProps, {
    toggleLeftmenu,
  })(withTranslation()(Navbar))
)
