import { Contract } from "ethers"
import ERC20Abi from "constants/abi/ERC20.json"

import { useCall, useCalls, useEthers } from "@usedapp/core"
import { useSelector } from "react-redux"

function useTokenInfo(tokenAddress) {
  const { selectedChain } = useSelector(state => state.User)

  const partialCall = tokenAddress && {
    contract: new Contract(tokenAddress, ERC20Abi),
    address: tokenAddress,
    args: [],
  }
  const args = ["name", "symbol", "decimals", "totalSupply"].map(
    method => partialCall && { ...partialCall, method }
  )
  const [name, symbol, decimals, totalSupply] = useCalls(args, {
    chainId: selectedChain,
    refresh: "never",
  })

  if (!name && !symbol && !decimals && !totalSupply) {
    return undefined
  }

  return {
    name: name?.value[0] ?? "",
    symbol: symbol?.value[0] ?? "",
    decimals: decimals?.value[0],
    totalSupply: totalSupply?.value[0],
  }
}

export default useTokenInfo
