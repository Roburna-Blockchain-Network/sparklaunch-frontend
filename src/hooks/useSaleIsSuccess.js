import Web3 from "web3";
import SaleAbi from "constants/abi/Sale.json"



async function getUseSaleIsSuccess(saleAddress) {
  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const contract = new web3.eth.Contract(SaleAbi, saleAddress);
    const success = await contract.methods.isSaleSuccessful().call();
    return success;
  } catch (err) {
    console.log(err);
  }
}

export default getUseSaleIsSuccess
