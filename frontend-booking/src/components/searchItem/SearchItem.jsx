import { Link } from 'react-router-dom'
import './SearchItem.css'

// for /hotels route
//fetching item to List.jsx


//two components linked to /hotels route, list.jsx and searchItem.jsx
const SearchItem = ({item}) => {
  console.log("SearchItem data:", item); 
  return (
    <div className='searchItem'>
        <img src={item.photos[0]} alt="" 
        className='siImg'/>
        <div className="siDesc">
        <h1 div className="siTitle">{item.name}</h1>
        {/* <span className='siDistance'>{item.distance}</span> */}
        <span className='siTaxiOp'>Free Cancellation</span>
        <span className='siSubtitle'>Studio Apartments</span>
        <span className='siFeatures'>{item.desc}</span>
        
        
        </div>
        <div className="siDetails">
          {item.rating && <div className="siRating">  
            <span>Excellent</span>
            <button>{item.rating}</button>
          </div>}
          
          <div className="siDetailTexts">
            <span className="siPrice">Rs.{item.cheapestPrice}</span>
            <span className="siTaxOp">Includes taxes and fees</span>
            <Link to = {`/hotels/${item._id}`}><button className='siCheckButton'>See availability</button></Link>
          </div>
        </div>
    </div>
  )
}
// condition for rating if item.rating then show me the rating 
export default SearchItem
