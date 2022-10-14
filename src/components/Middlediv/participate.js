import React, { useEffect } from 'react'

import { selectedSale } from '../Home/salecards';
import { participateInsale } from '../../connect/dataProccessing';

const Participate = ({ setopenModal11, setopenModal10, setopenModal9, toggle1 }) => {

   { useEffect(()=>{
        console.log('selected sale', selectedSale)
     
    },[]) }

    return (
        <>
            <div className='participate_div'>
                <div className="participate_heading" 
                onClick={() => {; toggle1(); setopenModal11(false); setopenModal10(false); setopenModal9(true); }}>
                    participate
                </div>
            
                        <div className='participate_amount'>
                        Amount (max:10BNB) <br></br> 
                        <input id="amount" className='participateAmount' placeholder='0.1'></input>
                        </div>
                       
                        <div className='innerparticipate_button'>
                            <div id="button_15" onClick={()=>{participateInsale()}}>Buy</div>
                        </div>
                
            </div>
            
        </>)
}

export default  Participate;