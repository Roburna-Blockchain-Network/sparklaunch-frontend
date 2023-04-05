import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useEthers, ChainId } from "@usedapp/core"

import { connect, useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import classnames from "classnames"

// Redux Store
import {
  clearAllSales,
  setLoginStatus,
  showRightSidebarAction,
  toggleLeftmenu,
} from "store/actions"

import { Dropdown, Nav, Navbar } from "react-bootstrap"

// import images
import logoSM from "assets/images/logos/smlogo.png"
import logoLG from "assets/images/logos/lglogo.png"

import bscLogo from "assets/images/logos/bsc.png"
import roburnaLogo from "assets/images/logos/roburna.png"
import { SUPPORTED_CHAIN } from "constants/Address"

const Header = props => {
  const { account, activateBrowserWallet, deactivate, switchNetwork, chainId } =
    useEthers()

  const users = useSelector(state => state.User)

  const [logged, setLogged] = useState()


  const dispatch = useDispatch()
  let options = []
  options[97] = {
    id: 0,
    value: ChainId.BSCTestnet,
    text: "BSC Testnet",
    logo: bscLogo,
  }

  //options[159] = { id: 1, value: 159, text: "Roburna Chain", logo: roburnaLogo }

  const [selected, setSelected] = useState(options[97])
  //  // console.log(users)

  const handleSwitchNetwork = async e => {
    console.log(e)
    if (account) {
      if (chainId === e && users.selectedChain === e) {
        return
      } else {
        try {
          await switchNetwork(e)
          setSelected(options[e])
          activateBrowserWallet()
          dispatch(clearAllSales(false))
        } catch (error) {
          setSelected(options[chainId])
          alert(
            `Switch network to ${options[97].text} on your wallet to continue`
          )
        }
      }
    } else {
      if (users.selectedChain === e) {
        return
      } else {
        setSelected(options[e])
      }
    }
  }


  const handleConnectWallet = () => {
    if (account) {
      deactivate()
      setLogged()
    } else {
      try {
        activateBrowserWallet()
        setLogged(account)
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    if (typeof account == "undefined") {
      return
    }
    if (account && typeof logged == "undefined") {
      if (chainId !== 97) {
          switchNetwork(97)
      }

      setLogged(account)
      return
    }
    if (account !== logged) {
      window.location.reload()
    }
    console.log(logged)
  }, [account, logged])

  // useEffect(async () => {
  //   if (typeof account == "undefined") {
  //     dispatch(setLoginStatus(false))
  //   } else {
  //     dispatch(setLoginStatus(true))
  //   }
  // }, [account, chainId, dispatch])

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          {/* left section */}
          <div className="d-flex align-items-center">
            {/* open menu for small screens */}
            <button
              type="button"
              className="btn btn-sm ps-3 pe-1 font-size-16 d-lg-none header-item"
              data-toggle="collapse"
              onClick={() => props.toggleLeftmenu(!props.leftMenu)}
              data-target="#topnav-menu-content"
            >
              <i className="fa fa-fw fa-bars" />
            </button>

            <div className="navbar-brand-box ms-md-2 me-md-3">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logoSM} alt="" height="25px" />
                </span>
                <span className="logo-lg">
                  <img src={logoLG} alt="" height="80px" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoSM} alt="" height="25px" />
                </span>
                <span className="logo-lg">
                  <img src={logoLG} alt="" height="80px" />
                </span>
              </Link>
            </div>

            <Navbar className="p-0 navbar-dark d-none d-lg-inline">
              <Nav className="me-auto px-4 d-flex align-items-center">
                <Link
                  to="/"
                  className={classnames("nav-link me-3 px-0", {
                    active:
                      window.location.pathname === "/" ||
                      window.location.pathname === "/home",
                  })}
                >
                  HOME
                </Link>

                <Link
                  to="/#pools"
                  className={classnames("nav-link me-3 px-0", {
                    active: window.location.pathname === "/pools",
                  })}
                >
                  POOLS
                </Link>

                <a
                  href="https://spark-launch.gitbook.io/"
                  target="_blank"
                  className={classnames("nav-link me-3 px-0", {
                    active: window.location.pathname === "/about",
                  })}
                >
                  ABOUT
                </a>

                <Link
                  to="/token-locker"
                  className={classnames("nav-link me-3 px-0", {
                    active: window.location.pathname === "/token-locker",
                  })}
                >
                  TOKEN LOCKER
                </Link>
              </Nav>
            </Navbar>
          </div>

          {/* right section */}
          <div className="d-flex flex-fill  ms-2 align-items-center  justify-content-end">
            {/* <button className="btn btn-gradient-blue rounded-2 py-0 w-md me-3 d-none d-md-inline">
              PYRE GAMES
            </button> */}
            <a
              href="#sales"
              className="border border-2 border-primary text-white text-center me-4 fw-bold py-2 px-3 w-lg rounded-pill d-none d-lg-block"
            >
              <span className=" fs-6 ">BUY $IGNT</span>
            </a>
            <Dropdown className="me-3">
              <Dropdown.Toggle variant="warning" className="py-0 ps-0">
                <img
                  src={selected?.logo}
                  height={28}
                  className="me-1 bg-dark rounded p-1"
                />
                {selected?.text}
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark">
                {options.map((item, key) => (
                  <Dropdown.Item
                    key={key}
                    onClick={() => handleSwitchNetwork(item.value)}
                    //onClick={() => console.log(item.value)}
                  >
                    <img src={item.logo} height={18} className="me-2" />
                    {item.text}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {account ? (
              <button
                onClick={() => deactivate()}
                className="btn btn-sm btn-outline-primary text-primary rounded-3 me-3 ps-0 py-0 text-nowrap"
              >
                <i className="fa-solid fa-wallet text-primary border border-primary rounded p-1 me-1 fs-5" />
                {account.substring(0, 2)}...{account.substring(38, 42)}
              </button>
            ) : (
              <button
                className="btn btn-sm btn-primary text-white rounded-3 me-3 fw-bold"
                onClick={handleConnectWallet}
              >
                CONNECT WALLET
              </button>
            )}
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

Header.propTypes = {
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
}

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu } = state.Layout
  return { layoutType, showRightSidebar, leftMenu }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
})(Header)
