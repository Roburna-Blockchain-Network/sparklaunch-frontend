import React from 'react'
import 'assets/scss/custom/components/scroller.scss'

export default function Scroller() {

  function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }


  return (
    <div className='scroller' onClick={scrollToTop}>
        <img className='arrow-top' src='/images/arrow-top.png' />
    </div>
  )
}
