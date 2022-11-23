import { Contract } from "ethers"
import AdminAbi from "constants/abi/Admin.json"

import { useCall, useEthers } from "@usedapp/core"
import { FACTORY_ADDRESS, ADMIN_ADDRESS } from "constants/Address"
import { useSelector } from "react-redux"

function useIsAdmin() {
  const { value, error } =
    useCall({
      contract: new Contract(saleAddress, AdminAbi),
      method: "sale",
      args: [],
    }) ?? {}
  if (error) {
    return false
  }
  return value
}

export default useIsAdmin
