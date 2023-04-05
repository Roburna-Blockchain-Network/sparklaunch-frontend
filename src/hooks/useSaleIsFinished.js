import { Contract } from "ethers"
import SaleAbi from "constants/abi/Sale.json"

import { useCall, useEthers } from "@usedapp/core"
import { FACTORY_ADDRESS } from "constants/Address"

function useSaleFinished(saleAddress) {
  const { value, error } =
    useCall(
      {
        contract: new Contract(saleAddress, SaleAbi),
        method: "saleFinished",
        args: [],
      },
      {
        refresh: 20,
      }
    ) ?? {}
  if (error) {
    return error
  }
  return value?.[0]
}

export default useSaleFinished
