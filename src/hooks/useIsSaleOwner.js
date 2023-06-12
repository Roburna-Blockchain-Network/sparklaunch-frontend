import { Contract } from "ethers"
import AdminAbi from "constants/abi/Admin.json"
import SalesAbi from "constants/abi/Sales.json"

import { useCall, useEthers } from "@usedapp/core"
import { FACTORY_ADDRESS, ADMIN_ADDRESS } from "constants/Address"

function useIsSaleOwner(account) {
  const { value, error } =
    useCall({
      contract: new Contract(ADMIN_ADDRESS, SalesAbi),
      method: "isAdmin",
      args: [account],
    }) ?? {}
  if (error) {
    console.log(error)
    return false
  }
  return value?.[0]
}

export default useIsSaleOwner
