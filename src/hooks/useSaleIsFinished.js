import SaleAbi from "constants/abi/Sale.json"
import Web3 from "web3"

async function getUseSaleFinished(saleAddress) {
  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const contract = new web3.eth.Contract(SaleAbi, saleAddress);
    const isFinished = await contract.methods.saleFinished().call();
    return isFinished;
  } catch (err) {
    console.log(err);
  }
}

export default getUseSaleFinished
