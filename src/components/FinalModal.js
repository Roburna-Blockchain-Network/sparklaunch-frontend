import React from "react"
import "assets/scss/custom/components/modal.scss"

export default function FinalModal({show, handleClose}) {
  

  if (show) {
    return (
      <div className={`popup`}>
        <div className="d-flex w-100 h-100 justify-content-center align-items-center">
          <div className="popup-box">
            <div className="popup-header d-flex justify-content-between align-items-center">
              <h3 className="popup-title">Important</h3>
            </div>

            <div className="popup-body">
              <span className="popup-content">
              Please ensure that all details are correct before confirming as once 
              presales are confirmed they CAN NOT be amended. Spark Launch and 
              Ignite Defi take no responsibility for errors made while creating 
              your presale. By continuing you are agreeing to the Spark Launch 
              terms and conditions as found on our Gitbook.
              </span>
            </div>
            {/* button to close */}
            <div className="popup-footer">
              <button className="popup-btn rounded px-3" onClick={handleClose}>
                I Understand
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}
