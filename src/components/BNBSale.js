import React from 'react'
import { useState,useRef } from 'react'
import 'animate.css';

//nav bar section
import Header from './Header'

//displays on home page
import Featuredboxes from './Middlediv/Featuredboxes'
import Salecards from './Home/salecards.js'

//displays for launch sale
import Title from './Middlediv/title'
import Saleparams from './Middlediv/Saleparams'
import Urldiv from './Middlediv/url'
import Description from './Middlediv/description'

//displays for participate
import Pools1 from './Middlediv/pools1'
import Metamaskconnect from './Middlediv/metamaskconnect'
import Participate from './Middlediv/participate'

//footer section
import Footer from './Footer';

const MiddleBottomdiv = () => {

    const [openModal4, setopenModal4] = useState(false);
    const [openModal5, setopenModal5] = useState(true);
    const [openModal6, setopenModal6] = useState(false);
    const [openModal7, setopenModal7] = useState(false);
    const [openModal8, setopenModal8] = useState(false);
    const [openModal9, setopenModal9] = useState(false);
    const [openModal10, setopenModal10] = useState(false);
    const [openModal11, setopenModal11] = useState(false);

    
    var salecardsRef = useRef(null)

   var  scrollToSales = () => {

      salecardsRef.current?.scrollIntoView({behavior: 'smooth'});
    
    }
    


    const toggle = () => {
        var blur = document.getElementById('blur');
        blur.classList.toggle('active1');
    }
    const toggle1 = () => {
      
        var blur = document.getElementById('blur');
        blur.classList.toggle('inactive1');
    }

    return (
        <>
        <div className='container-fluid'>
         <Header/>
            {openModal5 &&
                <>
                    <div className='container-fuild'>
                        <div className="row content" >
                            <div className='container-fuild'>
                                <div className='row'>
                                    <div className='col'></div>
                                    <div className='col-6 home_logo'>
                                    <img className='image-fluid' src="/images/biglogo.png"/>
                                    </div>
                                    <div className='col'></div>
                                </div>
                                <div className='row launchbuy-row'>
                                    <div className='col-2'></div>
                                    <div className='col-5'>
                                        <button className='button launch-btn' onClick={() => { setopenModal4(true); setopenModal5(false); }}>
                                            LAUNCH YOUR PROJECT WITH US
                                        </button>
                                    </div>
                                    <div className='col-3'>
                                        <button className='button buy-btn' onClick={scrollToSales}>
                                            BUY $IGHT
                                        </button>
                                    </div>
                                    <div className='col-2'></div>
                                </div>
                                <div className='row featured-row'>

                                    <div className='container'>
                                        <div className='row'> 
                                                <p className="col-6 featured-name">FEATURED PROJECTS</p>
                                        </div>
                                        <div className='row'>
                                            <div className='featured-name-underline'></div>
                                        </div>
                                        <div className='row feature-card-row'>
                                      
                                           <Featuredboxes/>
                                        
                                        </div>
                                    

                                    </div>

                                    
                                </div>
                                <div className='row filter-row'>
                                    <div className='col-8 filter-buttons'>
                                        <button className='button filter-btn'>ALL SALES</button>
                                        <button className='button filter-btn'>UPCOMING</button>
                                        <button className='button filter-btn'>LIVE</button>
                                        <button className='button filter-btn'>ENDED</button>
                                    </div>
                                    <div className='col-4'>
                                      <input class="filter-search-name" type="search" placeholder="Search.." aria-label="Search"/>
                                      <img className='filter-search-icon' src='/images/Search.png'></img>
                                    </div>
                                
                                </div>
                                <div className='row cards-row'  ref={salecardsRef} >  
                                    <Salecards setopenModal9={setopenModal9} setopenModal5={setopenModal5} />
                                </div>
                                <div className='row'>
                                    <div className='container ask-btn-div'>
                                        <button className='ask-btn'>Ask Us</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }

            {openModal4 &&
                <>
                    <div className='main_div'>

                        <div className="middle_div" >
                                <button className='close_button' 
                                      onClick={() => { setopenModal4(false); setopenModal5(true); }}>
                                    Close
                                </button>
                                <div className="mainnets_dev">
                                    <option className='option'>
                                        <select></select>
                                    </option>
                                </div>
                                <div className="inner_div">
                                    <Title setopenModal6={setopenModal6} />
                                    
                                    {
                                        openModal6 &&
                                        <Saleparams setopenModal7={setopenModal7} />
                                    }
                                    {
                                        openModal7 &&
                                        <Urldiv setopenModal8={setopenModal8} />
                                    }
                                    {
                                        openModal8 &&
                                        <Description />
                                    }
                                </div>
                        </div>

                    </div>
                </>
            }

            {openModal9 &&
                <>
                    <div className="main_div" id="blur">
                        <div className="middle_div" >
                        <button className='close_button' 
                                    onClick={() => { setopenModal9(false);setopenModal5(true)}}>
                                    Close
                         </button>
                        <Pools1 setopenModal5={setopenModal5} setopenModal9={setopenModal9} 
                                setopenModal10={setopenModal10}  setopenModal11={setopenModal11} toggle={toggle}/>
                        </div>
                    </div>
                </>
            }

            {openModal10 &&

                <Metamaskconnect  
                        toggle1={toggle1} setopenModal11={setopenModal11}
                         setopenModal10={setopenModal10}  setopenModal9={setopenModal9}
                />
            }

            {openModal11 && 

                 <Participate  
                        toggle1={toggle1} setopenModal11={setopenModal11}  
                        setopenModal10={setopenModal10} setopenModal9={setopenModal9}
                 />
            }

         <Footer/> 
        
        </div>
       
        </>
    )

}

export default MiddleBottomdiv