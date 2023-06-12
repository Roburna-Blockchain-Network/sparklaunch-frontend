import FactoryAbi from "constants/abi/Factory.json"
import Web3 from "web3"
import { FACTORY_ADDRESS } from "constants/Address"

async function getUseDeploymentFee() {
  try{
  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  const contract = new web3.eth.Contract(FactoryAbi, FACTORY_ADDRESS);
  const fee = await contract.methods.fee().call();
  return fee;
  } catch (err) {
    console.log(err);
  }
}

export default getUseDeploymentFee
