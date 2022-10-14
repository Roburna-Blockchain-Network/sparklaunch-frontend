import React from 'react'

const salecard =(sale) => {


    return (
        <>  
            <div className='row card-title-row' >
             <div className='col-7'>
                    <div className='row'>
                        <p className='card-title-name'>{sale.name}</p>
                    </div>
                    <div className='row'>
                        <p className='card-title-symbol'>{sale.symbol}</p> 
                    </div>

                    <div className='row'>
                                <div className='kyc_images'>
                                        <a href={sale.telegram} target="_blank" rel="noopener noreferrer"><img className="spark_image_2_1" src="images/Vector2.png" /></a>
                                         <a href={sale.linkedIn} target="_blank" rel="noopener noreferrer"><img className="spark_image_2_1" src="images/Vector3.png" /> </a> 
                                        <a href={sale.discord} target="_blank" rel="noopener noreferrer"><img className="spark_image_2_1" src="images/Vector4.png" /></a>
                                        <a href={sale.twitter} target="_blank" rel="noopener noreferrer"> <img className="spark_image_2_1" src="images/Vector5.png" /> </a> 
                                </div>
                    </div>
                </div>

                <div className='col-5'>
                   <img className='img-fluid img-thumbnail card-title-img' src={sale.logo} alt=''/>
                </div>
            </div>

            <div className='kyc_boxes_inside_middle'>
                <div className="live_div">
                    <div id="button_12">{sale.status}</div>
                </div>
            </div>

            <div className='kyc_boxes_inside_middle_1'>
                <p className='middle_para'>
                    {sale.description}
                </p>
            </div>

            <div className='kyc_boxes_inside_last'>
                <div className="kyc_boxes_inside_last_left">
                    <div  style={{ marginTop: "0.7rem"}}>Soft Cap</div>
                    <div style={{ marginTop: "0.7rem" }}>Raised</div>
                    <div style={{ marginTop: "0.7rem" }}>Price</div>
                    <div style={{ marginTop: "0.7rem" }}>End</div>
                </div>
                <div className="kyc_boxes_inside_last_right">
                   <div style={{ marginTop: "0.7rem" }}>{sale.softCap} Token</div>
                   <div style={{ marginTop: "0.7rem" }}>{sale.raised} BNB</div>
                   <div  style={{ marginTop: "0.7rem" }}>{sale.price} BNB</div>
                   <div style={{ marginTop: "0.7rem", width: "15rem" }}> {sale.date.toUTCString()}
                   </div>
                </div>
            </div>

            <div className='registration'>
                <div id="registration">{sale.diff}</div>
                <div id="percentage">{sale.percentage}%</div>
            </div>

            <div className='potion_fill'>
                <div className='potion'>
                    {/* <div className='potion_flow'>
                    </div> */}
                    <div className="progress">
                        <div className="progress-bar"  style={{width:sale.percentage}} role="progressbar" aria-label="Basic example" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                   </div>

            </div>

            <div className='registration_1'>
                <div id="registration_1"></div>
                <div id="percentage_1"></div>
            </div>

            <div className='registration_2'>
                <div id="registration_2">Holders</div>
                <div id="percentage_2">Listing Time</div>
            </div>

            <div className='registration_3'>
                <div id="registration_3">{sale.holders}</div>
                <div id="percentage_3">{sale.listingDate}</div>
            </div> 

        </>
       )
}

export default salecard