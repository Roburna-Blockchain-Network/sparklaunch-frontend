import { Contract } from "ethers"
import SaleAbi from "constants/abi/Sale.json"

import { useCall, useEthers } from "@usedapp/core"
import { FACTORY_ADDRESS } from "constants/Address"

function useGetRound(saleAddress) {
  const { value, error } =
    useCall(
      {
        contract: new Contract(saleAddress, SaleAbi),
        method: "getCurrentRound",
        args: [],
      },
      {
        refresh: 20,
      }
    ) ?? {}
  if (error) {
    // console.log(error)
    return error
  }
  return value?.[0].toNumber()
}

export default useGetRound
