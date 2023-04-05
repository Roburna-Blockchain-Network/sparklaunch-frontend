import { Contract } from "ethers"
import FactoryAbi from "constants/abi/Factory.json"

import { useCall, useEthers } from "@usedapp/core"
import { FACTORY_ADDRESS } from "constants/Address"
import { useSelector } from "react-redux"

function useServiceFee() {
  const { value, error } =
    useCall({
      contract: new Contract(FACTORY_ADDRESS, FactoryAbi),
      method: "serviceFee",
      args: [],
    }) ?? {}
  if (error) {
    // console.log(error)
    return error
  }
  return value?.[0]
}

export default useServiceFee
