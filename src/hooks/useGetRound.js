// import { Contract } from "ethers"
import SaleAbi from "constants/abi/Sale.json"
import Web3 from "web3"
// import { useCall, useEthers } from "@usedapp/core"
import { FACTORY_ADDRESS } from "constants/Address"

async function getUseGetRound(saleAddress) {
  try{
  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  const contract = new web3.eth.Contract(SaleAbi, saleAddress);
  const round = await contract.methods.getCurrentRound().call();
  return round;
  } catch (err) {
    console.log(err);
  }

}

export default getUseGetRound
