import React from 'react'
import './Header.css'
import { assets} from '../../assets/assets'


const Header = () => {
  return (
    <div className="content">
      <div className="textbox">
        <h2>Take a bite and say <br /> <span>Yummie</span></h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur qui blanditiis fuga ducimus aperiam cupiditate.</p>
        <button>View Menu</button>
      </div>
      <div className="imgbox">
        <img src={assets.burger} alt="" className="starbucks" />
      </div>
    </div>
  )
}

export default Header