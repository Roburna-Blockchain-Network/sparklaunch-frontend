import React, { useState, useEffect } from "react"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import getUseGetRound from "hooks/useGetRound"
dayjs.extend(utc)

const RoundInfo = ({ sale }) => {
  const currentDate = dayjs.utc().unix()

  const [currentRound, setCurrentRound] = useState(0)

  const getCurrentRound = getUseGetRound(sale.address)

  useEffect(() => {
    if (typeof getCurrentRound == "undefined") {
      return
    }
    setCurrentRound(getCurrentRound)
  }, [getCurrentRound])

  // console.log(currentRound)

  return (
    <>
      {typeof currentRound !== "undefined" ? (
        <>
          <div className="d-flex w-100 flex-wrap mb-0 mt-3 py-1 border-bottom border-white border-opacity-50 text-center">
            <div className="w-100 fw-bold">Round Info</div>
          </div>

          {sale.round.round1 !== sale.start + 1 &&
            <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
              <div className="w-50 fw-bold">Round 1</div>
              <div className="text-primary">
                :{" "}
                {currentRound == 1
                  ? "On Going"
                  : sale.round.round1 > currentDate
                    ? "Not Started"
                    : "Finished"}
              </div>
            </div>
          }

          {sale.round.round2 !== sale.start + 2 &&
          <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
            <div className="w-50 fw-bold">Round 2</div>
            <div className="text-primary">
              :{" "}
              {currentRound == 2
                ? "On Going"
                : sale.round.round2 > currentDate
                  ? "Not Started"
                  : "Finished"}
            </div>
          </div>}

          {sale.round.round3 !== sale.start + 3 &&
          <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
            <div className="w-50 fw-bold">Round 3</div>
            <div className="text-primary">
              :{" "}
              {currentRound == 3
                ? "On Going"
                : sale.round.round3 > currentDate
                  ? "Not Started"
                  : "Finished"}
            </div>
          </div>}


          {sale.round.round4 !== sale.start + 4 &&
          <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
            <div className="w-50 fw-bold">Round 4</div>
            <div className="text-primary">
              :{" "}
              {currentRound == 4
                ? "On Going"
                : sale.round.round4 > currentDate
                  ? "Not Started"
                  : "Finished"}
            </div>
          </div>}

          {sale.round.round5 !== sale.start + 5 &&
          <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
            <div className="w-50 fw-bold">Round 5</div>
            <div className="text-primary">
              :{" "}
              {currentRound == 5 &&
                sale.round.round5 < currentDate &&
                currentDate < sale.round.public
                ? "On Going"
                : sale.round.round5 > currentDate
                  ? "Not Started"
                  : "Finished"}
            </div>
          </div>}

          <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
            <div className="w-50 fw-bold">Public Round</div>
            <div className="text-primary">
              :{" "}
              {currentRound == 5 &&
                sale.round.public < currentDate &&
                currentDate < sale.round.end
                ? "On Going"
                : sale.round.public > currentDate
                  ? "Not Started"
                  : "Finished"}
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}

export default RoundInfo
