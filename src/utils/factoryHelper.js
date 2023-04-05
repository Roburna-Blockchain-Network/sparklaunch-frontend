import {
  FACTORY_ADDRESS,
  ROUTER_ADDRESS,
  ADMIN_ADDRESS,
  API_URL,
  RPC_ADDRESS,
  MULTICALL_ADDRESS,
  CHAIN_NUMBER,
} from "constants/Address"

import ERC20ABI from "constants/abi/ERC20.json"
import FactoryABI from "constants/abi/Factory.json"
import AdminABI from "constants/abi/Admin.json"
import SaleABI from "constants/abi/Sale.json"
import SalesABI from "constants/abi/Sales.json"

import { ethers, BigNumber as BN } from "ethers"
import { Contract, Provider, setMulticallAddress } from "ethers-multicall"
import { parseEther, parseUnits } from "ethers/lib/utils"

const getSaleInfo = async address => {
  setMulticallAddress(CHAIN_NUMBER, MULTICALL_ADDRESS)
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS)
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
    calls.push(tokenContract.saleFinished())
    //  // console.log(calls)
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
      saleFinished,
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
        address: address,
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
        isFinished: saleFinished,
        // participants: numberOfParticipants.toNumber(),
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

export const getLpLockInfo = async address => {
  setMulticallAddress(CHAIN_NUMBER, MULTICALL_ADDRESS)
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS)
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()
  //   return AdminABI
  const tokenContract = new Contract(address, SalesABI)
  //   return tokenContract

  let calls = []
  let calls2 = []

  try {
    calls.push(tokenContract.defaultPair())

    const [pairAddress] = await ethcallProvider.all(calls)

    const pairContract = new Contract(pairAddress, ERC20ABI)

    calls2.push(pairContract.totalSupply())
    calls2.push(pairContract.balanceOf(address))

    const [supply, balance] = await ethcallProvider.all(calls2)

    const totalSupply = supply.toString()
    const totalLock = balance.toString()

    return {
      success: true,
      data: {
        totalSupply,
        totalLock,
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

export const getLockInfo = async address => {
  setMulticallAddress(CHAIN_NUMBER, MULTICALL_ADDRESS)
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS)
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
    calls.push(tokenContract.saleFinished())
    calls.push(tokenContract.isSaleSuccessful())
    calls.push(tokenContract.defaultPair())
    calls.push(tokenContract.liquidityUnlockTime())
    calls.push(tokenContract.liquidityLockPeriod())
    calls.push(tokenContract.lpWithdrawn())
    // calls.push(tokenContract.getNumberOfRegisteredUsers())
    //  // console.log(calls)
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
      saleFinished,
      isSaleSuccessful,
      defaultPair,
      liquidityUnlockTime,
      liquidityLockPeriod,
      lpWithdrawn,
      //   numberOfParticipants,
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
        address: address,
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
        isFinished: saleFinished,
        isSuccess: isSaleSuccessful,
        pair: defaultPair,
        unlockAt: liquidityUnlockTime.toNumber(),
        lockPeriod: liquidityLockPeriod.toNumber(),
        lpWithdrawn: lpWithdrawn,
        lockDate:
          liquidityUnlockTime.toNumber() - liquidityLockPeriod.toNumber(),
        // participants: numberOfParticipants.toNumber(),
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

const getRoundInfo = async address => {
  setMulticallAddress(CHAIN_NUMBER, MULTICALL_ADDRESS)
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS)
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

const getSaleAddressById = async id => {
  setMulticallAddress(CHAIN_NUMBER, MULTICALL_ADDRESS)
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS)
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()
  const tokenContract = new Contract(FACTORY_ADDRESS, FactoryABI)

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

const getTotalSaleDeployed = async () => {
  setMulticallAddress(CHAIN_NUMBER, MULTICALL_ADDRESS)
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS)
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()
  const tokenContract = new Contract(FACTORY_ADDRESS, FactoryABI)

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
const getUserParticipation = async (saleAddress, userAddress) => {
  setMulticallAddress(CHAIN_NUMBER, MULTICALL_ADDRESS)
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS)
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()
  const tokenContract = new Contract(saleAddress, SalesABI)

  let calls = []
  try {
    calls.push(tokenContract.getParticipation(userAddress))
    const [data] = await ethcallProvider.all(calls)

    return {
      success: true,
      data: {
        tokenB: data[0],
        token: data[0].toString(),
        native: data[1].toString(),
        tier: data[2].toString(),
        tokenWithdrawn: data[3],
        nativeWithdrawn: data[4],
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

const getSaleDetails = async address => {}

const getTokenAllowance = async (token, address) => {
  setMulticallAddress(CHAIN_NUMBER, MULTICALL_ADDRESS)
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS)
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()

  const tokenContract = new Contract(token, ERC20ABI)
  let calls = []
  try {
    calls.push(tokenContract.allowance(address, FACTORY_ADDRESS))
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

const getTokenInfo = async address => {
  setMulticallAddress(CHAIN_NUMBER, MULTICALL_ADDRESS)
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS)
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
  getUserParticipation,
}
