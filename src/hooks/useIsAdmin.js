import { Contract } from "ethers"
import AdminAbi from "constants/abi/Admin.json"

import { useCall, useEthers } from "@usedapp/core"
import { FACTORY_ADDRESS, ADMIN_ADDRESS } from "constants/Address"

function useIsAdmin(account) {
  const { value, error } =
    useCall({
      contract: new Contract(ADMIN_ADDRESS, AdminAbi),
      method: "isAdmin",
      args: [account],
    }) ?? {}
  if (error) {
    return false
  }
  return value?.[0]
}

export default useIsAdmin
