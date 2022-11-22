import React from "react"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

const RoundInfo = ({ saleInfo, roundInfo }) => {
  const currentDate = dayjs.utc().unix()
  return (
    <>
      <div className="d-flex w-100 flex-wrap mb-0 mt-3 py-1 border-bottom border-white border-opacity-50 text-center">
        <div className="w-100 fw-bold">Round Info</div>
      </div>

      <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
        <div className="w-50 fw-bold">Round 1</div>
        <div className="text-primary">
          :{" "}
          {saleInfo.getCurrentRound == 1 && roundInfo.round1 > currentDate
            ? "On Going"
            : "Ended"}
        </div>
      </div>
      <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
        <div className="w-50 fw-bold">Round 2</div>
        <div className="text-primary">
          :{" "}
          {saleInfo.getCurrentRound == 2 && roundInfo.round2 > currentDate
            ? "On Going"
            : "Ended"}
        </div>
      </div>

      <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
        <div className="w-50 fw-bold">Round 3</div>
        <div className="text-primary">
          :{" "}
          {saleInfo.getCurrentRound == 3 && roundInfo.round3 > currentDate
            ? "On Going"
            : "Ended"}
        </div>
      </div>

      <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
        <div className="w-50 fw-bold">Round 4</div>
        <div className="text-primary">
          :{" "}
          {saleInfo.getCurrentRound == 4 && roundInfo.round4 > currentDate
            ? "On Going"
            : "Ended"}
        </div>
      </div>

      <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
        <div className="w-50 fw-bold">Round 5</div>
        <div className="text-primary">
          :{" "}
          {saleInfo.getCurrentRound == 5 &&
          roundInfo.round5 > currentDate &&
          currentDate < roundInfo.publicRound
            ? "On Going"
            : "Ended"}
        </div>
      </div>

      <div className="d-flex w-100 flex-wrap mb-0 py-1 border-bottom border-white border-opacity-50">
        <div className="w-50 fw-bold">Public Round</div>
        <div className="text-primary">
          :{" "}
          {saleInfo.getCurrentRound == 5 &&
          roundInfo.publicRound < currentDate &&
          currentDate < roundInfo.end
            ? "On Going"
            : "Ended"}
        </div>
      </div>
    </>
  )
}

export default RoundInfo
