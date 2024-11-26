import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import Search from '../../components/Header/Search'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'

const Home = () => {

  const [category, setCategory] = useState('all');

  return (
    <div className='home'>
      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay  category={category} />
    </div>
  )
}

export default Home