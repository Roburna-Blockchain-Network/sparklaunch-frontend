import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import PropTypes from "prop-types"

//actions
import {
  changeLayout,
  changeTopbarTheme,
  changeLayoutWidth,
} from "store/actions"

//redux
import { useSelector, useDispatch } from "react-redux"

//components
import Navbar from "./Navbar"
import Header from "./Header"
import Footer from "./Footer"
import Scroller from "components/Scroller"

const Layout = props => {
  const dispatch = useDispatch()
  const [showScroller, setShowScroller] = useState(false)
  const [isMenuOpened, setIsMenuOpened] = useState(false)

  function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      setShowScroller(true)
    } else {
      setShowScroller(false)
    }
  }

  useEffect(() => {
    window.onscroll = function () { scrollFunction() };
  })


  const { topbarTheme, layoutWidth, isPreloader } = useSelector(state => ({
    topbarTheme: state.Layout.topbarTheme,
    layoutWidth: state.Layout.layoutWidth,
    isPreloader: state.Layout.isPreloader,
    showRightSidebar: state.Layout.showRightSidebar,
  }))

  /*
  document title
  */
  useEffect(() => {
    const title = props.location.pathname
    let currentage = title.charAt(1).toUpperCase() + title.slice(2)

    document.title = currentage ? currentage + " | Sparklaunch" : "Sparklaunch"
  }, [props.location.pathname])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  /*
  layout settings
  */
  useEffect(() => {
    dispatch(changeLayout("horizontal"))
  }, [dispatch])

  useEffect(() => {
    if (isPreloader === true) {
      document.getElementById("preloader").style.display = "block"
      document.getElementById("status").style.display = "block"

      setTimeout(() => {
        if (
          document.getElementById("preloader") !== null &&
          document.getElementById("status") !== null
        ) {
          document.getElementById("preloader").style.display = "none"
          document.getElementById("status").style.display = "none"
        }
      }, 1500)
    } else {
      document.getElementById("preloader").style.display = "none"
      document.getElementById("status").style.display = "none"
    }
  }, [isPreloader])

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme))
    }
  }, [dispatch, topbarTheme])

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth))
    }
  }, [dispatch, layoutWidth])

  const openMenu = () => {
    setIsMenuOpened(!isMenuOpened)
  }

  return (
    <React.Fragment>
      <div id="preloader">
        <div id="status">
          <div className="spinner-chase">
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
          </div>
        </div>
      </div>

      <div id="layout-wrapper">
        <Header
          theme={topbarTheme}
          isMenuOpened={isMenuOpened}
          openLeftMenuCallBack={openMenu}
          pathname={props.location.pathname}
        />
        <Navbar menuOpen={isMenuOpened} />
        <div className="main-content">{props.children}</div>
        {showScroller && <Scroller />}
        <Footer pathname={props.location.pathname} />
      </div>
    </React.Fragment>
  )
}

Layout.propTypes = {
  changeLayout: PropTypes.func,
  changeLayoutWidth: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  isPreloader: PropTypes.any,
  layoutWidth: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
}

export default withRouter(Layout)
