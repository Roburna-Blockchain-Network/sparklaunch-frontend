import AdminAbi from "constants/abi/Admin.json"
import Web3 from "web3"
import {  ADMIN_ADDRESS } from "constants/Address"

async function getUseIsAdmin(account) {
  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  const contract = new web3.eth.Contract(AdminAbi, ADMIN_ADDRESS);
  console.log(account, "account")
  // const test="0xaEa574007c8ad33c7f4f7CF4a0d0B6F704ACD59e"
  const isAdmin = await contract.methods.isAdmin(account).call();
  return isAdmin;
}

export default getUseIsAdmin
