import SaleAbi from "constants/abi/Sale.json"
import Web3 from "web3"


async function getUseSaleInfo(saleAddress) {
  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const contract = new web3.eth.Contract(SaleAbi, saleAddress);
    const sale = await contract.methods.sale().call();
    return sale;
  } catch (err) {
    console.log(err);
  }
}

export default getUseSaleInfo
