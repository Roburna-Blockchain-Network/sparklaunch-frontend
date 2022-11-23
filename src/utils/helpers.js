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

export const isValidUrl = urlString => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ) // validate fragment locator
  return !!urlPattern.test(urlString)
}

// 10 token = 1 bnb
