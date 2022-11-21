import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils"
import moment from "moment"

export const datetimeToTimestamp = data => {
  return moment(data).unix()
}

export const tokenRate = (value, tokenDecimal) => {
  const DECIMAL = parseUnits("1", tokenDecimal)
  // const MULTIPLY = parseUnits("1", "18")
  const bnbRate = parseUnits("1", "18")
  return bnbRate.mul(DECIMAL).div(value).div(bnbRate)
}

// 10 token = 1 bnb
