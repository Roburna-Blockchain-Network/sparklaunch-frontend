import { Contract } from "ethers"
import FactoryAbi from "constants/abi/Factory.json"

import { useCall, useEthers } from "@usedapp/core"
import { FACTORY_ADDRESS } from "constants/Address"

function useDeploymentFee() {
  const { chainId } = useEthers()
  const { value, error } =
    useCall({
      contract: new Contract(FACTORY_ADDRESS[chainId], FactoryAbi),
      method: "fee",
      args: [],
    }) ?? {}
  if (error) {
    console.log(error)
    return error
  }
  return value?.[0]
}

export default useDeploymentFee
