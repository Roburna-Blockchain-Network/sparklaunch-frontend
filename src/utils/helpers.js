import { BigNumber } from "ethers"
import { formatUnits, parseUnits } from "ethers/lib/utils"
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

export const NativePrice = (value, tokenDecimal) => {
  const EXCACT_VALUE = formatUnits(BigNumber.from(value), tokenDecimal)
  const bnbRate = 1 / Number(EXCACT_VALUE)
  return bnbRate
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

export function nFormatter(num, digits = 2) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "Q" },
    { value: 1e18, symbol: "E" },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0"
}

export function formatNumber(x, max = 6) {
  return x.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: max,
  })
}

export const formatBigToNum = (val, dec, comma = 3) => {
  // Convert the value to Ether and truncate to 3 decimal places
  let num = val / 10**18;
  num = num.toString();
  let index = num.indexOf('.');
  if (index != -1 && index + 4 < num.length) {
    num = num.substring(0, index + 4);
  }
  return Number(num);
}