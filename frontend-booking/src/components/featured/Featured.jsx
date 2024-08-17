import useFetch from '../../hooks/useFetch'
import './Featured.css'

const Featured = () => {
 
  const {data, loading, error} = useFetch("/api/hotels/countByCity?cities=dubai,abudhabi,sharjah") //keep in mind this url
  console.log(data)

  return (
    <div className='featured'>
      {loading ? ("Loading please wait"): (
        <><div className="featuredItem">
      <img src="https://media.istockphoto.com/id/1333035210/photo/sunset-view-of-the-dubai-marina-and-jbr-area-and-the-famous-ferris-wheel-and-golden-sand.jpg?s=612x612&w=0&k=20&c=ONRt8hlovwg0m8f6Q3OG5Spavaer2JCaAioUE-XM_r8=" alt="" className="featuredImg"/>
        <div className="featuredTitles">
        <h1>Dubai</h1>
        <h2>{data[0]}</h2>
        </div>
      </div>

      <div className="featuredItem">
        <img src="https://www.shutterstock.com/image-photo/stunning-sandy-beach-near-corniche-600nw-2290958483.jpg" alt="" className="featuredImg" />
        <div className="featuredTitles">
        <h1>Abu Dhabi</h1>
        <h2>{data[1]}</h2>
        </div>
      </div>

      <div className="featuredItem">
        <img src="https://st2.depositphotos.com/1007593/6773/i/450/depositphotos_67738841-stock-photo-abu-dhabi-skyline.jpg" alt="" className="featuredImg" />
        <div className="featuredTitles">
        <h1>Sharjah</h1>
        <h2>{data[2]}</h2>
        </div>
      </div></>)}

      {/* <div className="featuredItem">
        <img src="https://media.istockphoto.com/id/1345426734/photo/eiffel-tower-paris-river-seine-sunset-twilight-france.jpg?s=612x612&w=0&k=20&c=I5rAH5d_-Yyag8F0CKzk9vzMr_1rgkAASGTE11YMh9A=" alt="" className="featuredImg" />
        <div className="featuredTitles">
        <h1>France</h1>
        <h2>Fantasies of France</h2>
        </div>
      </div> */}

      {/* <div className="featuredItem">
        <img src="https://st2.depositphotos.com/1007593/6773/i/450/depositphotos_67738841-stock-photo-abu-dhabi-skyline.jpg" alt="" className="featuredImg" />
        <div className="featuredTitles">
        <h1>Abu Dhabi</h1>
        <h2>Explore the luxury of Abu Dhabi</h2>
        </div>
      </div> */}
    </div>
  )
}

export default Featured
