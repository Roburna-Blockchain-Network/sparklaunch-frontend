const { ChainId } = require("@usedapp/core")

const FACTORY_ADDRESS = "0x2b211Ec39ED1211538641Cbe89d5A39c58EBB86f"
const ADMIN_ADDRESS = "0xf2FD1Cd32819bE7c88E2DC9Dfb063E8333146605"
const ROUTER_ADDRESS = "0x2fAe743821Bbc2CfD025C7E6B3Ee01ae202dd48B"
const RPC_ADDRESS = "https://preseed-testnet-1.roburna.com/"
const MULTICALL_ADDRESS = "0x4e1845Ab1d9D464150777a931Ce8FDaaD1cf8229"
const CHAIN_NUMBER = 159

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

export const SUPPORTED_CHAIN = [159]

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
