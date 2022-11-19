import {
  FACTORY_ADDRESS,
  ROUTER_ADDRESS,
  ADMIN_ADDRESS,
  API_URL,
  RPC_ADDRESS,
  MULTICALL_ADDRESS,
} from "constants/Address"

import ERC20ABI from "constants/abi/ERC20.json"
import FactoryABI from "constants/abi/Factory.json"
import AdminABI from "constants/abi/Admin.json"
import SaleABI from "constants/abi/Sale.json"
import SalesABI from "constants/abi/Sales.json"

import { ethers } from "ethers"
import { Contract, Provider, setMulticallAddress } from "ethers-multicall"

const getSaleInfo = async (chain, address) => {
  setMulticallAddress(chain, MULTICALL_ADDRESS[chain])
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS[chain])
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()
  //   return AdminABI
  const tokenContract = new Contract(address, SalesABI)
  //   return tokenContract

  let calls = []
  try {
    calls.push(tokenContract.sale())
    calls.push(tokenContract.saleStartTime())
    calls.push(tokenContract.minParticipation())
    calls.push(tokenContract.maxParticipation())
    calls.push(tokenContract.lpPercentage())
    calls.push(tokenContract.defaultPair())
    calls.push(tokenContract.pcsListingRate())
    calls.push(tokenContract.BNBAmountForLiquidity())
    calls.push(tokenContract.tokensAmountForLiquidity())
    calls.push(tokenContract.publicRoundStartDelta())
    calls.push(tokenContract.getCurrentRound())
    calls.push(tokenContract.tierIdToTierStartTime(5))
    // console.log(calls)
    const [
      sale,
      saleStart,
      min,
      max,
      lpPercent,
      defaultPair,
      listingRate,
      bnbLiquidity,
      tokenLiquidity,
      publicRoundStartDelta,
      getCurrentRound,
      tierIdToTierStartTime,
    ] = await ethcallProvider.all(calls)

    return {
      success: true,
      data: {
        sale: sale,
        saleStart: saleStart,
        min: min,
        max: max,
        lpPercent: lpPercent,
        defaultPair: defaultPair,
        listingRate: listingRate,
        bnbLiquidity: bnbLiquidity,
        tokenLiquidity: tokenLiquidity,
        publicRoundStartDelta: publicRoundStartDelta,
        getCurrentRound: getCurrentRound,
        tierIdToTierStartTime: tierIdToTierStartTime,
      },
    }
  } catch (error) {
    return {
      success: false,
      data: { address },
      msg: error,
    }
  }
}
const getTokenInfo = async (chain, address) => {
  setMulticallAddress(chain, MULTICALL_ADDRESS[chain])
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS[chain])
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()

  const tokenContract = new Contract(address, ERC20ABI)
  let calls = []
  try {
    calls.push(tokenContract.name())
    calls.push(tokenContract.symbol())
    calls.push(tokenContract.decimals())
    calls.push(tokenContract.totalSupply())

    const [name, symbol, decimals, totalSupply] = await ethcallProvider.all(
      calls
    )
    return {
      success: true,
      data: {
        name: name,
        symbol: symbol,
        decimals: decimals,
        totalSupply: totalSupply.toString(),
      },
    }
  } catch (error) {
    return {
      success: false,
      data: {},
    }
  }
}

export { getSaleInfo, getTokenInfo }
