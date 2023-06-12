import SaleAbi from "constants/abi/Sale.json"
import Web3 from "web3"

async function getUseParticipationData(saleAddress, account) {
  // const { value, error } =
  //   useCall(
  //     {
  //       contract: new Contract(saleAddress, SaleAbi),
  //       method: "getParticipation",
  //       args: [account],
  //     },
  //     {
  //       refresh: 20,
  //     }
  //   ) ?? {}
  // if (error) {
  //   //  // console.log(error)
  //   return false
  // }
  // return value
  if (account===undefined) return;
  try{
  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  const contract = new web3.eth.Contract(SaleAbi, saleAddress);
  console.log(account)
  const isParticipant = await contract.methods.getParticipation(account).call();
  console.log(isParticipant)
  return isParticipant;
  } catch (err) {
    console.log(err);
  }

}

export default getUseParticipationData
