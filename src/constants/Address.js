const { ChainId } = require("@usedapp/core")
import { BSCTestnet } from '@usedapp/core'


// Roburna Chain
//const FACTORY_ADDRESS = "0x063217681f14A0bd87EeD8B07a1c484F5E522f63"
//const ADMIN_ADDRESS = "0x1778A06AcF8d44B813c494b5C5395811466735F0"
//const ROUTER_ADDRESS = "0x2fAe743821Bbc2CfD025C7E6B3Ee01ae202dd48B"
//const RPC_ADDRESS = "https://preseed-testnet-1.roburna.com/"
// const MULTICALL_ADDRESS = "0x4e1845Ab1d9D464150777a931Ce8FDaaD1cf8229"
//const CHAIN_NUMBER = 159


// BSC Testnet
const RPC_ADDRESS = "https://data-seed-prebsc-1-s1.binance.org:8545/"
const FACTORY_ADDRESS = "0xfD48d8347cCe07189Ba7CdAdAbB8A6633a4763ad"
const ADMIN_ADDRESS = "0x910Ad70E105224f503067DAe10b518F73B07b5cD"
const ROUTER_ADDRESS = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3"
const CHAIN_NUMBER = 97
const MULTICALL_ADDRESS = "0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576"



// const FACTORY_ADDRESS = {
//   [ChainId.BSCTestnet]: "0x0Ce8fF4ff0fa1C37deC51c46FbC06F9C9e2079e2",
//   159: "0x2b211Ec39ED1211538641Cbe89d5A39c58EBB86f",
// }

// const ADMIN_ADDRESS = {
//   [ChainId.BSCTestnet]: "0xA78AeFa96c0AA49CE2aD1c9a6cB88aC0eaE49363",
//   159: "0xf2FD1Cd32819bE7c88E2DC9Dfb063E8333146605",
// }

// const ROUTER_ADDRESS = {
//   [ChainId.BSCTestnet]: "0x4e1845Ab1d9D464150777a931Ce8FDaaD1cf8229",
//   159: "0x2fAe743821Bbc2CfD025C7E6B3Ee01ae202dd48B",
// }

// const RPC_ADDRESS = {
//   [ChainId.BSCTestnet]: "https://rpc.ankr.com/bsc_testnet_chapel",
//   159: "https://preseed-testnet-1.roburna.com/",
// }

// const MULTICALL_ADDRESS = {
//   [ChainId.BSCTestnet]: "0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576",
//   159: "0x4e1845Ab1d9D464150777a931Ce8FDaaD1cf8229",
// }

//export const SUPPORTED_CHAIN = [159]
// export const CHAIN_NATIVE_SYMBOL = "RBA"
// export const WRAPPED_SYMBOL = "WRBA"
// export const DEFAULT_DEX = "ARBORSWAP"

export const SUPPORTED_CHAIN = [ChainId.BSCTestnet]
export const CHAIN_NATIVE_SYMBOL = "BNB"
export const WRAPPED_SYMBOL = "WBNB"
export const DEFAULT_DEX = "PANCAKESWAP"

const API_URL = process.env.REACT_APP_BACKEND_URL

export {
  FACTORY_ADDRESS,
  ADMIN_ADDRESS,
  API_URL,
  ROUTER_ADDRESS,
  RPC_ADDRESS,
  MULTICALL_ADDRESS,
  CHAIN_NUMBER,
}
