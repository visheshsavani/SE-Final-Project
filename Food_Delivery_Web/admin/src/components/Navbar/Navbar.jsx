import React from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets.js'

const Navbar = () => {
  return (
    <div className='navbar'>
     <div className="logo-name">Yummie</div>
     <img src={assets.profile_image} alt="" className='profile'/>
    </div>
  )
}

export default Navbar