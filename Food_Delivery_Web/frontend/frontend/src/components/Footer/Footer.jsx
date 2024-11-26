import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className="footer" id='footer'>
     <div className="footer-content">
          <div className='footer-content-left'>
          <div className="logo-name">Yummie</div>
               <p>Yummie is a leading food discovery and delivery platform that connects users with restaurants, cafes, and eateries around them. It allows users to explore, order, and enjoy their favorite meals, all with a few taps. Whether you're looking to dine out, order food online, or discover new places, YUMMIE makes it easier than ever.</p>
               <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
               </div>
          </div>
          <div className='footer-content-center'>
               <h2>COMPANY</h2>
               <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
               </ul>
          </div>
          <div className='footer-content-right'>
               <h2>GET IN TOUCH</h2>
               <ul>
                    <li>9326039327</li>
                    <li>yummie.admin@gmail.com</li>
               </ul>
          </div>
     </div>
     <hr />
     <p className="footer-copyright">
          all right are reserved
     </p>
    </div>
  )
}

export default Footer