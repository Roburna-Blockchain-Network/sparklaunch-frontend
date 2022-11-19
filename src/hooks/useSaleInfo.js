import { Contract } from "ethers"
import SaleAbi from "constants/abi/Sale.json"

import { useCall, useEthers } from "@usedapp/core"
import { FACTORY_ADDRESS } from "constants/Address"
import { useSelector } from "react-redux"

function useSaleInfo(saleAddress) {
  const { selectedChain } = useSelector(state => state.User)
  const { value, error } =
    useCall(
      {
        contract: new Contract(saleAddress, SaleAbi),
        method: "sale",
        args: [],
      },
      {
        refresh: "never",
        chainId: selectedChain,
      }
    ) ?? {}
  if (error) {
    console.log(error)
    return error
  }
  return value
}

export default useSaleInfo
