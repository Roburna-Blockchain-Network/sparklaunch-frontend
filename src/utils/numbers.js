import BigNumber from "bignumber.js"
import { ethers } from "ethers"
import { formatUnits } from "ethers/lib/utils"

export const getLanguageCodeFromLS = () => {
  try {
    const codeFromStorage = localStorage.getItem(LS_KEY)

    return codeFromStorage || EN.locale
  } catch {
    return EN.locale
  }
}

export const BIG_ZERO = new BigNumber(0)
export const BIG_ONE = new BigNumber(1)
export const BIG_NINE = new BigNumber(9)
export const BIG_TEN = new BigNumber(10)

export const ethersToSerializedBigNumber = ethersBn =>
  ethersToBigNumber(ethersBn).toJSON()

export const ethersToBigNumber = ethersBn => new BigNumber(ethersBn.toString())

/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (amount, decimals = 18) => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals))
}

export const getBalanceAmount = (amount, decimals = 18) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals))
}

/**
 * This function is not really necessary but is used throughout the site.
 */
export const getBalanceNumber = (balance, decimals = 18) => {
  return getBalanceAmount(balance, decimals).toNumber()
}

export const getFullDisplayBalance = (
  balance,
  decimals = 18,
  displayDecimals
) => {
  return getBalanceAmount(balance, decimals).toFixed(displayDecimals)
}

export const formatNumber = (number, minPrecision = 1, maxPrecision = 8) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  }
  return number.toLocaleString("en-US", options)
}

export const formatBigNumber = (
  number,
  decimals,
  minPrecision = 1,
  maxPrecision = 8
) => {
  const formatted = Number(formatUnits(number, decimals))
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  }
  //   return formatted
  return formatted.toLocaleString("en-US", options)
}

export const formatNumberWithoutComma = (
  number,
  minPrecision = 1,
  maxPrecision = 8
) => {
  return formatNumber(number, minPrecision, maxPrecision)
    .toString()
    .replaceAll(",", "")
}

/**
 * Method to format the display of wei given an ethers.BigNumber object with toFixed
 * Note: rounds
 */
export const formatBigNumberToFixed = (
  number,
  displayDecimals = 18,
  decimals = 18
) => {
  const formattedString = formatUnits(number, decimals)
  return (+formattedString).toFixed(displayDecimals)
}

/**
 * Formats a FixedNumber like BigNumber
 * i.e. Formats 9763410526137450427.1196 into 9.763 (3 display decimals)
 */
export const formatFixedNumber = (
  number,
  displayDecimals = 18,
  decimals = 18
) => {
  // Remove decimal
  const [leftSide] = number.toString().split(".")
  return formatBigNumber(
    ethers.BigNumber.from(leftSide),
    displayDecimals,
    decimals
  )
}

export const formatLocalisedCompactNumber = number => {
  const codeFromStorage = getLanguageCodeFromLS()
  return new Intl.NumberFormat(codeFromStorage, {
    notation: "compact",
    compactDisplay: "long",
    maximumSignificantDigits: 2,
  }).format(number)
}

export default formatLocalisedCompactNumber
