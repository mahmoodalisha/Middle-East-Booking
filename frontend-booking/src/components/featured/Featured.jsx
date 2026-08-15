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
              src="https://images.unsplash.com/photo-1608991156162-3c55b3cf05d3?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGR1YmFpJTIwbmlnaHR8ZW58MHx8MHx8fDA%3D"
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
              src="https://i.etsystatic.com/25397710/r/il/f08db4/3454964276/il_1080xN.3454964276_jjgx.jpg"
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