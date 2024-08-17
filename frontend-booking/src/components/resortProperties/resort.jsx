import './resort.css'
import useFetch from '../../hooks/useFetch';
const FeaturedProperties = () => {

  const {data, loading, error} = useFetch("/api/hotels?featured=true&limit=3")
  console.log(data)

  return (
    <div className='fp'>
        <div className="fpItem">
    <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/216634325.jpg?k=4a57650d380cc4951c7425c4e28a42e260b7ccb3e8f371e5d7348a9c7273d4d5&o=&hp=1" alt="" />
    <span className='fpName'>Banyan Tree Bangkok</span>
    <span className='fpCity'>Thailand</span>
    <span className='fpPrice'>Starting from $120</span>
    <div className="fpRating">
        <button>9.1</button>
        <span>Excellent</span>
        </div>
        </div>

        
        <div className="fpItem">
        <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/219015874.jpg?k=40bd536a1ce6b6f2a5e57a2c2b930b7c01b2f269a9f482412db97a3c9e8f6697&o=&hp=1" alt="" />
    <span className='fpName'>Four Seasons Resort Bali at Sayan</span>
    <span className='fpCity'>Indonesia</span>
    <span className='fpPrice'>Starting from $200</span>
    <div className="fpRating">
        <button>8.9</button>
        <span>Excellent</span>
        </div>
        </div> 

         <div className="fpItem">
        <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/d7/ca/34/rooftop-pool.jpg?w=1200&h=-1&s=1" alt="" />
    <span className='fpName'>The Ritz-Carlton Kuala Lumpur</span>
    <span className='fpCity'>Malaysia</span>
    <span className='fpPrice'>Starting from $150</span>
    <div className="fpRating">
        <button>9.5</button>
        <span>Excellent</span>
        </div>
        </div> 


    </div>

    
  )
}

export default FeaturedProperties
