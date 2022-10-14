  import { ethers } from "ethers"

  import { factoryABI, saleABI , adminABI, testABI} from "./abi";
  import { selectedSale } from "../components/Home/salecards";
  import { formatDistanceToNow } from "date-fns";
import { formatEther } from "ethers/lib/utils";
 
  //const backendURL = 'http://localhost:3001/sale'
  const backendURL = 'https://sparklaunch-backend.herokuapp.com/sale'
  
  const ADMIN_ADDRESS = '0x45B1379Be4A4f389B67D7Ad41dB5222f7104D26C'
  const FACTORY_ADDRESS = '0x863B229F7d5e41D76C49bC9922983B0c3a096CDF'
  const SALETOKEN_ADDRESS = '0xCdC76670B62Fd02F1724C976a337E8768fe01fd7'
  const { ethereum } = window;
  export let provider
    
  if(!ethereum){
    console.log('Install MetaMask')
    alert("Please install Metamask")
  } else {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  }

  const FactoryContract = new ethers.Contract(FACTORY_ADDRESS, factoryABI, provider);
  const AdminContract = new ethers.Contract(ADMIN_ADDRESS, adminABI, provider)

  
  export const fetchSaleInfor = async () => {
    let salesData = [];
    try{

        const salesNO  = await FactoryContract.getNumberOfSalesDeployed()

        if(salesNO.toNumber() === 0) {
          console.log('No sale deployed')
        } else 
        {
              const response = await fetch(`${backendURL}/deployed/true`);
              const DBdata = await response.json();
              console.log('DB Data:', DBdata)

             

             await DBdata.map(  async sale =>  
                
                {

                  const saleID =  await sale._id

                  //console.log('SaleID',saleID)

                  //get sale address
                  const saleAddressObject = await FactoryContract.saleIdToAddress(saleID);
                  const saleAddress = saleAddressObject.toString()
                  //console.log(saleAddress)
                  
                  if (saleAddress === '0x0000000000000000000000000000000000000000') {console.log('sale in DB but not deployed')}
                  else
                  {
                      //get sale chainData
                      const saleContract =  new ethers.Contract(saleAddress, saleABI, provider);
                      const chainData = await saleContract.sale();
                      //console.log('Data',chainData)
                      
                      //get NO of participants
                      const noOfParticipants =await saleContract.numberOfParticipants()
                      const holders = noOfParticipants.toNumber()
                      //console.log('Holders', holders)

                      //format data for display
                      let dateObject = new Date(chainData.saleEnd.toString()*1000)

                      //get max and min participation
                      const minBuy = await saleContract.minParticipation()
                      const maxBuy = await saleContract.maxParticipation()

                      //get sale start, isFinished
                      const isFinished = await saleContract.saleFinished()
                      const saleStartTime = await saleContract.saleStartTime()
                      
                      //console.log('raised',chainData.totalBNBRaised/10**18)
                      //console.log('hardcap',chainData.hardCap/10**18 )
                      //console.log('price',chainData.tokenPriceInBNB/10**18)
                      //console.log('Logo:', sale.saleLinks.logo)

                      const percentage = () => {
                        const raised = chainData.totalBNBRaised/10**18
                        const hardCap = chainData.hardCap/10**18
                        const price = chainData.tokenPriceInBNB/10**18

                        const value = raised/(hardCap *price) * 100
                        if(value > 0) {return value} else {return 0}
                      }
                      
                      //const end = chainData.saleEnd.toString()*1000
                      const timeDiff = () => {
                          const  diffEnd = formatDistanceToNow(chainData.saleEnd.toString()*1000)
                          const diffStart = formatDistanceToNow(saleStartTime.toNumber()*1000)
                           if(isFinished){ return 'Sale Closed'
                          }else if(Date.now()/1000 < saleStartTime.toNumber()){
                                return 'Sale starts in ' + diffStart
                          } else if (Date.now()/1000 < chainData.saleEnd.toString()) {
                                return 'Sale ends in '+ diffEnd
                          } else {
                                return 'Sale ended in '+ diffEnd
                          }
                        }

                      const status = () => {
                            if(isFinished){ return 'CLOSED'
                          }else if(Date.now()/1000 < saleStartTime.toNumber()){
                                return 'UPCOMMING'
                          } else if (Date.now()/1000 < chainData.saleEnd.toString()) {
                                return 'LIVE'
                          } else if (chainData.saleEnd.toNumber() === 0){ 
                                return 'NOT-SET' 
                          } else return 'ENDED'

                          }

                      

                      //console.log('status:', status())

                    
                         
                     let saleDBChain = 
                    
                      {     
                          id:sale._id,  
                          saleToken: {
                          name: sale.saleToken.name,
                          symbol: sale.saleToken.symbol,
                          address: sale.saleToken.address,
                          },
                          saleParams: {
                            softCap:chainData.softCap.toString()/10**18,
                            hardCap:chainData.hardCap.toString()/10**18,
                            raised:chainData.totalBNBRaised.toString()/10**18,
                            price:chainData.tokenPriceInBNB.toString()/10**18,
                            startDate:sale.saleParams.startDate,
                            endDate:dateObject,
                            minBuy:minBuy.toString()/10**18,
                            maxBuy:maxBuy.toString()/10**18,
                            firstRelease:sale.saleParams.firstRelease,
                            eachRelease:sale.saleParams.eachRelease,
                            vestingDays: sale.saleParams.vestingDay
                          },
                          saleLinks: {
                            logo:sale.saleLinks.logo,
                            fb:sale.saleLinks.fb,
                            git:sale.saleLinks.git,
                            insta:sale.saleLinks.insta,
                            reddit:sale.saleLinks.reddit,
                    
                            web: sale.saleLinks.web,
                            twitter: sale.saleLinks.twitter,
                            telegram: sale.saleLinks.telegram,
                            discord: sale.saleLinks.discord,
                            youtube: sale.saleLinks.youtube
                          },
                          saleDetails:{
                          saleID:sale.saleDetails.saleID,
                          saleAddress:saleAddress,
                          saleOwner:chainData.saleOwner.toString(),
                          description:sale.saleDetails.description,
                          holders:holders,
                          listingDate: sale.saleDetails.listingDate,
                          percentage:percentage(),
                          diff: timeDiff(),
                          status: status()
                          },
                      }

                    salesData.push(saleDBChain)
                  }
                  
                }

                );
              
             return {salesNO, salesData}
          }

    } catch(e) {console.log("Err: ", e.message)}
    
  }

  export const fetchFeaturedsale = async () => {
    try {

      const response = await fetch(`${backendURL}/featured/true`)
      const data = await response.json() 
      console.log('Featured Data', data)
       return data
      
    } catch (error) {
      console.log(error.message)
    }
  }

  export const postData = async () =>  {

    

    const name = document.getElementById("name").value
    const symbol = document.getElementById("symbol").value
    const address =document.getElementById("address").value

    const softCap=document.getElementById("softCap").value
    const hardCap=document.getElementById("hardCap").value
    const price=document.getElementById("price").value
    const startDate=document.getElementById("startDate").value
    const endDate=document.getElementById("endDate").value
    const minBuy=document.getElementById("minBuy").value
    const maxBuy=document.getElementById("maxBuy").value
    const firstRelease=document.getElementById("firstRelease").value
    const vestingDays=document.getElementById("vestingDays").value
    const eachRelease=document.getElementById("eachRelease").value


    const logo=document.getElementById("logo").value
    const fb=document.getElementById("fb").value
    const git=document.getElementById("git").value
    const insta=document.getElementById("insta").value
    const reddit=document.getElementById("reddit").value

    const web=document.getElementById("web").value
    const twitter=document.getElementById("twitter").value
    const telegram=document.getElementById("telegram").value
    const discord=document.getElementById("discord").value
    const youtube=document.getElementById("youtube").value
    const description=document.getElementById("description").value


    if(maxBuy < minBuy) {
      alert("maxBuy is less than minBuy")
    } else {

          const input = JSON.stringify( 
              {
                
                  saleToken:
                      {
                          name: name,
                          symbol: symbol,
                          address: address
                      },
                  saleParams: 
                      {
                          softCap:softCap,
                          hardCap:hardCap,
                          price:price,
                          startDate:startDate,
                          endDate:endDate,
                          minBuy:minBuy,
                          maxBuy:maxBuy,
                          firstRelease:firstRelease,
                          eachRelease:eachRelease,
                          vestingDays: vestingDays
                      },
                  saleLinks: {
                          logo: logo,
                          fb:fb,
                          git:git,
                          insta:insta,
                          reddit:reddit,
                  
                          web: web,
                          twitter: twitter,
                          telegram: telegram,
                          discord: discord,
                          youtube: youtube
                  },
                  saleDetails:{
                    saleOwner:ethereum.selectedAddress,
                    description: description
                  },

              }
          
          )
          
          const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: input
          };

          try{
          
              const response = await fetch(`${backendURL}`, requestOptions);
              const data = await response.json();
              console.log('Data:',data)
              let id = await data._id
              let softCap = data.saleParams.softCap
              let hardCap = data.saleParams.hardCap
              let minBuy = data.saleParams.minBuy
              let maxBuy = data.saleParams.maxBuy

              console.log('Post To DB','ID:', id, 'softCap',softCap, 'hardcap', hardCap, 'Minbuy',minBuy, 'Maxbuy', maxBuy)

              return {id,minBuy, maxBuy}

          } catch(e) {console.log("Err: ", e.message)}

          //console.log(data)
      }
        

  }

  export const deploySale = async () => {
              
        try {

            if (!ethereum) 
              {
                console.log('Please install MetaMask')
                alert('Please install MetaMask')

              } else 
              {
      
                 const connect = await ethereum.request({ method: 'eth_requestAccounts' });

                 if (connect) 
                 {
                  const {id,minBuy, maxBuy} = await postData()
                  console.log('Return Values',id,minBuy, maxBuy)

                  // //fetch saleId from db
                  // const response = await fetch(`${backendURL}/id${id}`);
                  // const data = await response.json();
                  // console.log('B4Deploy:', data[0])
                  // console.log('SaleID:',data[0].saleDetails.saleID)
                  
                  // const saleId = async () => {

                  //   var saleID = await data[0].saleDetails.saleID
                  //   console.log('SaleID:undifined  ', saleID)

                  //   if(!saleID) {

                  //     const response = await fetch(`${backendURL}/id${id}`);
                  //     const data = await response.json();
                  //     saleID = await data[0].saleDetails.saleID
                  //     console.log('SaleID:difined  ', saleID)

                  //     return(saleID)

                  //   } else {return saleID}
                  // }
          
                  //signer needed for transaction 
                  const signer = provider.getSigner();
                  
                  const FactoryContract = new ethers.Contract(FACTORY_ADDRESS, factoryABI, signer);

                  let balance = await provider.getBalance(ethereum.selectedAddress);
                  let bal = ethers.utils.formatEther(balance);

                  let deployFee = await FactoryContract.fee()
                  let fee =  ethers.utils.formatEther(deployFee)

                  if(bal < fee){

                      console.log("insufficient funds")
                      alert("insufficient funds")
                  } 
                  else {

                        const tx = await FactoryContract.deployNormalSale(
                        ethers.utils.parseUnits(minBuy.toString(), 'ether'),
                        ethers.utils.parseUnits(maxBuy.toString(), 'ether'),
                        id,
                        {value:deployFee})

                        await tx.wait()

                        let saleAddress = await FactoryContract.saleIdToAddress(id)
                        console.log('SaleAddress:',saleAddress)

                        if(saleAddress) {

                          const input = JSON.stringify( 
                              {
                                  deployed:true,
                                  saleAddress:saleAddress
                
                              }
                          )
                          
                          const requestOptions = {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: input
                          };

                        const response = await fetch(`${backendURL}/deploy/${id}`, requestOptions)
                        const data = await response.json()

                        console.log("data aft put", data)

                        // console.log('Deployed?:', data.saleDetails.deployed)
                        // console.log('saleOwner:', data.saleDetails.saleAddress)

                        console.log('Account:',ethereum.selectedAddress)
                        console.log("Bal4:",bal)
                        console.log('fee:',fee)
                        const BalAFT = await provider.getBalance(ethereum.selectedAddress)
                        console.log('BalAFT:', formatEther(BalAFT))

                        }
                        
                    }
                  
                  }
              }

            }
               catch (error) 
               {console.log("Error:", error.message)}    
      
  }

  export const participateInsale = async ()  =>  {

    const amount = document.getElementById('amount').value
    const amountInWei = ethers.utils.parseUnits( amount.toString(), 'ether')

    try {

      //connect if not connected
      await ethereum.request({ method: 'eth_requestAccounts' });

      //get sale address
      const saleAddressObject = await FactoryContract.saleIdToAddress(selectedSale);
      const saleAddress = saleAddressObject.toString()
    
    //get sale chainData
      const signer = provider.getSigner(ethereum.selectedAddress)
      const saleContract =  new ethers.Contract(saleAddress, saleABI, signer);
      const sale = await await saleContract.sale()
      console.log('sale',sale.isCreated)

      if(!sale.isCreated) {
        console.log('sale Params not set')
      } else if(!sale.tokensDeposited) {
        console.log('Sale tokens were not deposited')
      } else 
      
      {

        const userTierObject = await saleContract.tier(ethereum.selectedAddress);
        const userTier = userTierObject.toNumber()
        console.log('userTier',userTier)


        if(userTier === 0) {
          console.log('No tier granted')

        } else 
        
        {

          if(await saleContract.isParticipated(ethereum.selectedAddress)) {

            console.log('Already Participated')
            console.log(amountInWei.toString())
          } else 
          {
            //Participate
          const  tx= await saleContract.participate(userTier, {value:amountInWei})
          tx.wait()
          console.log(tx)

          }
        }
    }  
    } catch (error) {

      console.log(error.message)
      
    }
  }

  export const withdraw = async () => {
    try {


      //connect if not connected
      await ethereum.request({ method: 'eth_requestAccounts' });

      //get sale address
      const saleAddress = await FactoryContract.saleIdToAddress(selectedSale);
      
    //get sale chainData
      const signer = provider.getSigner(ethereum.selectedAddress)
      const saleContract =  new ethers.Contract(saleAddress, saleABI, signer)
      const sale = await saleContract.sale()
      if(!sale.isCreated) {
        console.log('params not set')
      } else if(!await saleContract.saleFinished()) {
          console.log("Sale not Finished")
      } else if( ! await saleContract.isParticipated(ethereum.selectedAddress)) {
        console.log('You did not participate')
      } else if(!await saleContract.isSaleSuccessful()) {
        console.log("sale Not successful")
      } else {
        const tx = await saleContract.withdraw()
        tx.wait()
        console.log('tx:',tx)
      }

      
    } catch (error) {
      console.log(error.message)
    }
  }

  export const withdrawUnused = async () => {
    try {


      //connect if not connected
      await ethereum.request({ method: 'eth_requestAccounts' });

      //get sale address
      const saleAddress = await FactoryContract.saleIdToAddress(selectedSale);
      
      // create signer
      const signer = provider.getSigner(ethereum.selectedAddress)

      //connect to sale
      const saleContract =  new ethers.Contract(saleAddress, saleABI, signer)

        //get sale chain data
      const sale = await saleContract.sale()

      if(!sale.isCreated) {
        console.log('params not set')
      } else if(!await saleContract.saleFinished()) {
          console.log("Sale not Finished")
      } else if( ! await saleContract.isParticipated(ethereum.selectedAddress)) {
        console.log('You did not participate')
      } else if(await saleContract.isSaleSuccessful()) {
        console.log("sale was successful, withdraw instead")
      } else {
        const tx = await saleContract.withdrawUserFundsIfSaleCancelled()
        tx.wait()
        console.log('tx:',tx)
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  export const finishSale = async () => {
    try {

      //get sale Data
      const signer = provider.getSigner(ethereum.selectedAddress)

      //get sale address
      const saleAddress = await FactoryContract.saleIdToAddress(selectedSale);
      const saleContract =  new ethers.Contract(saleAddress, saleABI, signer)

      if (await saleContract.saleFinished()) {
        console.log('sale aready Finished')

      } else if(! await AdminContract.isAdmin(ethereum.selectedAddress)) {
        console.log('Caller not the admin')
      } else
      {
          //finish sale
          const tx = await saleContract.finishSale()
          tx.wait()
          console.log('tx:',tx)
      }
      
    } catch (error) {
      console.log('Error:',error.message)
    }
  }

  export const depositTokens = async () => {
    try {

      //connect if not connected
      await ethereum.request({ method: 'eth_requestAccounts' });

      
      if (selectedSale === 0) {
        console.log('selected sale lost, please refresh')
      } else
      {
        //get sale address
        const saleAddress = await FactoryContract.saleIdToAddress(selectedSale);
      
        //Create signer
        const signer = provider.getSigner(ethereum.selectedAddress)

        //get connect to contract
        const saleContract =  new ethers.Contract(saleAddress, saleABI, signer)
        const BUSDContract = new ethers.Contract(SALETOKEN_ADDRESS, testABI, signer)

        //get sale details
        const sale = await saleContract.sale()
      
      //compare address
        const compare = sale.saleOwner.toString().toLowerCase() ===  ethereum.selectedAddress.toString().toLowerCase()
        console.log('compare', compare)

        if(!sale.isCreated) {
        console.log('params not set')
        } else if(!compare) {
            console.log('Not sale owner')
        } else if(sale.tokensDeposited) {
            console.log("Already deposited")
        } else {
            const approve = await BUSDContract.approve(saleAddress, sale.hardCap)
            approve.wait()
            console.log("Approve",approve)
            
            if(approve) {
              const deposit = await saleContract.depositTokens()
              deposit.wait()
              console.log('deposit:',deposit)
            }
          }
      }
    
  } catch (error) {
    console.log(error.message)
  }
  }

  export const withdrawDeposit = async () => {
    try {

      //connect if not connected
      await ethereum.request({ method: 'eth_requestAccounts' });

      
      if (selectedSale === 0) {
        console.log('selected sale lost, please refresh')
      } else
      {
        //get sale address
        const saleAddress = await FactoryContract.saleIdToAddress(selectedSale);
      
        //Create signer
        const signer = provider.getSigner(ethereum.selectedAddress)

        //get connect to contract
        const saleContract =  new ethers.Contract(saleAddress, saleABI, signer)

        //get sale details
        const sale = await saleContract.sale()
      
      
        const compare = sale.saleOwner.toString().toLowerCase() ===  ethereum.selectedAddress.toString().toLowerCase()
        console.log('compare', compare)

        if(!sale.isCreated) {
        console.log('params not set')
        } else if(!compare) {
            console.log('Not sale owner')
        } else if(!await saleContract.saleFinished()) {
            console.log("Sale not finished")
        } else if(await saleContract.isSaleSuccessful()) {
        console.log("sale was successful, withdraw earning instead")
        } else {
        const tx = await saleContract.withdrawDepositedTokensIfSaleCancelled()
        tx.wait()
        console.log('tx:',tx)
        }
      }
    
  } catch (error) {
    console.log(error.message)
  }
  }

  export const withdrawEarnings = async () => {

    var errorMsg = document.getElementById('errormsg')
    try {

      //connect if not connected
      await ethereum.request({ method: 'eth_requestAccounts' });

      
      if (selectedSale === 0) {
        console.log('selected sale lost, please refresh')
        errorMsg.innerText = 'Selected sale lost, please refresh'
      } else
      {
        //get sale address
        const saleAddress = await FactoryContract.saleIdToAddress(selectedSale);
      
        //Create signer
        const signer = provider.getSigner(ethereum.selectedAddress)

        //get connect to contract
        const saleContract =  new ethers.Contract(saleAddress, saleABI, signer)
      
        //get sale details
        const sale = await saleContract.sale()
      
      //compare address
        const compare = sale.saleOwner.toString().toLowerCase() ===  ethereum.selectedAddress.toString().toLowerCase()
        console.log('compare', compare)

        if(!sale.isCreated) {
        console.log('params not set')
        errorMsg.innerText = 'params not set'
        } else if(!compare) {
            console.log('Not sale owner')
            errorMsg.innerText = 'Not sale owner'
        } else if(!await saleContract.saleFinished()) {
          console.log('sale still running')
          errorMsg.innerText = 'sale still running'
        } else if(! await saleContract.isSaleSuccessful()) {
            console.log("sale was cancled,withdraw deposited instead")
            errorMsg.innerText = 'sale was cancled.Withdraw deposited instead'
        } else if (sale.earningsWithdrawn) {
          console.log("Aready withdraw")
          errorMsg.innerText = "Aready withdraw"
        }
        else {
        const tx = await saleContract.withdrawEarningsAndLeftover()
        tx.wait()
        console.log('tx:',tx)
        }
      }
    
  } catch (error) {
    console.log(error.message)
  }
  }

 