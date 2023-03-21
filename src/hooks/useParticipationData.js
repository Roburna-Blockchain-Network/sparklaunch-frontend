import { Contract } from "ethers"
import SaleAbi from "constants/abi/Sale.json"

import { useCall, useEthers } from "@usedapp/core"
import { FACTORY_ADDRESS } from "constants/Address"

function useParticipationData(saleAddress, account) {
  const { value, error } =
    useCall(
      {
        contract: new Contract(saleAddress, SaleAbi),
        method: "getParticipation",
        args: [account],
      },
      {
        refresh: 20,
      }
    ) ?? {}
  if (error) {
    //  // console.log(error)
    return false
  }
  return value
}

export default useParticipationData
