import React from "react"
import "assets/scss/custom/components/modal.scss"
export default function Modal() {
  const [show, setShow] = React.useState(true)

  const handleClose = () => setShow(false)

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
                Projects with taxes, please ensure that you whitelist the
                presale contract address in your token contract functions.
                Failure to do this may result in loss of tokens, funds and
                difficulty finalising your presale. Spark Launch and its parent
                group Ignite Defi are not responsible for any errors.
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
