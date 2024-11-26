import React from 'react'
import './Search.css'

const Search = () => {
     return (
          <div class="main">
               <p class="scroll-text">scroll to search</p>
               <p class="down-arrow">⬇️</p>
               <h3>Discover the best food & drinks in Mumbai</h3>
               <div class="search-bar">
                    {/* <p>SIcon</p> */}
                    <input type="text" placeholder="search here" />
                    <button className="search">search</button>
               </div>
          </div>

     )
}

export default Search