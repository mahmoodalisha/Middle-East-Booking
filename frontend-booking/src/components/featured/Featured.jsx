import useFetch from '../../hooks/useFetch'
import './Featured.css'

const Featured = () => {
  const apiBase = process.env.REACT_APP_SERVER_URL;
  const { loading, error } = useFetch(
    `${apiBase}/api/hotels/countByCity?cities=dubai,abudhabi,sharjah`
  );

  return (
    <div className='featured'>
      {loading ? (
        <div>Loading please wait...</div>
      ) : error ? (
        <div className="error">
          Something went wrong. Please try again later.
        </div>
      ) : (
        <>
          <div className="featuredItem">
            <img
              src="https://media.istockphoto.com/id/1333035210/photo/sunset-view-of-the-dubai-marina-and-jbr-area-and-the-famous-ferris-wheel-and-golden-sand.jpg?s=612x612&w=0&k=20&c=ONRt8hlovwg0m8f6Q3OG5Spavaer2JCaAioUE-XM_r8="
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Dubai</h1>
            </div>
          </div>

          <div className="featuredItem">
            <img
              src="https://blog.sothebysrealty.ae/hs-fs/hubfs/Imported_Blog_Media/Hotels%20in%20Dubai-jpg-Oct-12-2025-09-37-16-4150-AM.jpg?width=1600&height=1067&name=Hotels%20in%20Dubai-jpg-Oct-12-2025-09-37-16-4150-AM.jpg"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Abu Dhabi</h1>
            </div>
          </div>

          <div className="featuredItem">
            <img
              src="https://st2.depositphotos.com/1007593/6773/i/450/depositphotos_67738841-stock-photo-abu-dhabi-skyline.jpg"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Sharjah</h1>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Featured;