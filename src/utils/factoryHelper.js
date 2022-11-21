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

import { ethers, BigNumber as BN } from "ethers"
import { Contract, Provider, setMulticallAddress } from "ethers-multicall"
import { parseUnits } from "ethers/lib/utils"

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
    calls.push(tokenContract.defaultDexRouter())
    calls.push(tokenContract.pcsListingRate())
    calls.push(tokenContract.BNBAmountForLiquidity())
    calls.push(tokenContract.tokensAmountForLiquidity())
    calls.push(tokenContract.publicRoundStartDelta())
    calls.push(tokenContract.getCurrentRound())
    // console.log(calls)
    const [
      sale,
      saleStart,
      min,
      max,
      lpPercent,
      defaultDexRouter,
      listingRate,
      bnbLiquidity,
      tokenLiquidity,
      publicRoundStartDelta,
      getCurrentRound,
    ] = await ethcallProvider.all(calls)

    const bnbDecimals = parseUnits("1", "18")
    const hardCapBNB = sale.hardCap
      .mul(sale.tokenPriceInBNB)
      .div(bnbDecimals)
      .toString()
    const softCapBNB = sale.softCap
      .mul(sale.tokenPriceInBNB)
      .div(bnbDecimals)
      .toString()
    return {
      success: true,
      data: {
        saleStart: saleStart.toNumber(),
        saleEnd: sale.saleEnd.toNumber(),
        softCapBNB: softCapBNB,
        hardCapBNB: hardCapBNB,
        softCap: sale.softCap.toString(),
        hardCap: sale.hardCap.toString(),
        tokenPrice: sale.tokenPriceInBNB.toString(),
        tokenPriceBNB: sale.tokenPriceInBNB.toString(),
        raisedBNB: sale.totalBNBRaised.toString(),
        soldToken: sale.totalTokensSold.toString(),
        saleOwner: sale.saleOwner,
        isPublic: sale.isPublic,
        earningsWithdrawn: sale.earningsWithdrawn,
        min: min.toString(),
        max: max.toString(),
        lpPercent: lpPercent.div("100").toNumber(),
        defaultDexRouter: defaultDexRouter,
        listingRate: listingRate.toString(),
        bnbLiquidity: bnbLiquidity.toString(),
        tokenLiquidity: tokenLiquidity.toString(),
        publicRoundStartDelta: publicRoundStartDelta.toNumber(),
        getCurrentRound: getCurrentRound.toNumber(),
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

const getRoundInfo = async (chain, address) => {
  setMulticallAddress(chain, MULTICALL_ADDRESS[chain])
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS[chain])
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()
  const tokenContract = new Contract(address, SalesABI)

  let calls = []
  try {
    calls.push(tokenContract.tierIdToTierStartTime(1))
    calls.push(tokenContract.tierIdToTierStartTime(2))
    calls.push(tokenContract.tierIdToTierStartTime(3))
    calls.push(tokenContract.tierIdToTierStartTime(4))
    calls.push(tokenContract.tierIdToTierStartTime(5))
    calls.push(tokenContract.publicRoundStartDelta())
    calls.push(tokenContract.saleStartTime())
    calls.push(tokenContract.getCurrentRound())
    calls.push(tokenContract.sale())
    const [
      round1,
      round2,
      round3,
      round4,
      round5,
      delta,
      start,
      currentRound,
      sale,
    ] = await ethcallProvider.all(calls)

    const end = BN.from(sale.saleEnd).toNumber()
    const publicRound = BN.from(round5).add(delta).toNumber()

    return {
      success: true,
      data: {
        round1: BN.from(round1).toNumber(),
        round2: BN.from(round2).toNumber(),
        round3: BN.from(round3).toNumber(),
        round4: BN.from(round4).toNumber(),
        round5: BN.from(round5).toNumber(),
        round5: BN.from(round5).toNumber(),
        start: BN.from(start).toNumber(),
        end: end,
        publicRound: publicRound,
        activeRound: BN.from(currentRound).toNumber(),
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

const getSaleAddressById = async (chain, id) => {
  setMulticallAddress(chain, MULTICALL_ADDRESS[chain])
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS[chain])
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()
  const tokenContract = new Contract(FACTORY_ADDRESS[chain], FactoryABI)

  let calls = []
  try {
    calls.push(tokenContract.getSaleAddress(id))
    const [saleAddress] = await ethcallProvider.all(calls)

    return {
      success: true,
      data: {
        saleAddress: saleAddress,
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

const getTotalSaleDeployed = async chain => {
  setMulticallAddress(chain, MULTICALL_ADDRESS[chain])
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS[chain])
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()
  const tokenContract = new Contract(FACTORY_ADDRESS[chain], FactoryABI)

  let calls = []
  try {
    calls.push(tokenContract.getNumberOfSalesDeployed())
    const [totalSales] = await ethcallProvider.all(calls)

    return {
      success: true,
      data: {
        totalSales: totalSales,
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

const getSaleDetails = async (chain, address) => {}

const getTokenAllowance = async (chain, token, address) => {
  setMulticallAddress(chain, MULTICALL_ADDRESS[chain])
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS[chain])
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()

  const tokenContract = new Contract(token, ERC20ABI)
  let calls = []
  try {
    calls.push(tokenContract.allowance(address, FACTORY_ADDRESS[chain]))
    const [userAllow] = await ethcallProvider.all(calls)
    return {
      success: true,
      data: {
        allowance: userAllow.toString(),
      },
    }
  } catch (error) {
    return {
      success: false,
      data: {},
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

export {
  getSaleInfo,
  getTokenInfo,
  getRoundInfo,
  getSaleAddressById,
  getTokenAllowance,
}
