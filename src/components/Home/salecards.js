import React, {useState, useEffect, useRef}  from 'react'

import Salecard from '../Home/Salecard'
import {fetchSaleInfor} from '../../connect/dataProccessing'


export var selectedSale = 0
export var saleList, setSaleList
export var getSaleList = () => {}

export var scrollToSales = () => {}


function Salecards ({setopenModal9,setopenModal5}){
     
     var [saleList, setSaleList] = useState([])
     var [salesInfor, setSaleInfor ] = useState([])

     

    getSaleList = () => {
      return salesInfor.salesData.length
    }
  
    function handleClick(e){
      console.log('Main Target:',e.currentTarget.id);
      selectedSale = e.currentTarget.id
      console.log('Inner currentTarget',e.target)

      if(e.target.className === "spark_image_2_1") {
        console.log('Inner ClassName',e.target.className)
        void(0);
      } else {
      setopenModal9(true);
      setopenModal5(false);
      console.log('Selected Sale:',selectedSale) }
    }
  
    async function displayCard(){

       setSaleInfor( salesInfor = await fetchSaleInfor())
        console.log('sale NO',salesInfor.salesNO.toNumber())
        console.log('saleInfor',salesInfor.salesData)
        console.log('saleInforLength',salesInfor.salesData.length)

        setSaleList(saleList =

            <div className="loading-div">
            <img className="loading" src='images/smlogo.png'/>
            </div>  
        )
 
        let timerId = setInterval(function() {

              //console.log('salecard saleData 5s wait',salesInfor.salesData)
              //console.log('Compare',salesInfor.salesData.length === salesInfor.salesNO.toNumber())

              setSaleList( saleList =   salesInfor.salesData.map((sale)=> 

                <div id={sale.id} className="sale-card" key={sale.id} onClick={handleClick} >  
              
                <Salecard
                    ID={sale.saleDetails.saleID}
                    name={sale.saleToken.name}
                    symbol={sale.saleToken.symbol}
                    description={sale.saleDetails.description}
                    softCap={sale.saleParams.softCap}
                    raised={sale.saleParams.raised}
                    price={sale.saleParams.price}
                    date={sale.saleParams.endDate}
                    holders={sale.saleDetails.holders}
                    listingDate={sale.saleDetails.listingDate}
                    percentage={sale.saleDetails.percentage}
                    diff={sale.saleDetails.diff}
                    telegram={sale.saleLinks.telegram}
                    discord={sale.saleLinks.discord}
                    twitter={sale.saleLinks.twitter}
                    logo={sale.saleLinks.logo}
                    status={sale.saleDetails.status}
                />

                </div>

              ))


              {console.log('salecard saleList 5s wait',saleList)}

    
        }, 5000);

          
        setTimeout(() => { 
              clearInterval(timerId);

          if(salesInfor.salesNO.toNumber()===salesInfor.salesData.length){
            console.log('Loaded')
          } else alert('Failed to load, timeout 15s'); }, 20000);
        

    }


    { useEffect(()=>{
      displayCard()
     
   },[])}  
    

    return (
        <> 
        
         {saleList}
         
        
        </>
    )
}

export default Salecards

