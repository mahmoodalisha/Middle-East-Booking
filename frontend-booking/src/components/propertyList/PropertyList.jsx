import React from 'react';
import useFetch from '../../hooks/useFetch';
import './PropertyList.css';

const PropertyList = () => {
  const { data, loading, error } = useFetch("api/hotels/countByType");
  console.log(data);

  const images = [
    "https://img.freepik.com/free-photo/movie-night-by-pool-whole-family_1268-31098.jpg?size=626&ext=jpg&ga=GA1.1.586287953.1715266447&semt=sph",
    "https://www.usnews.com/object/image/00000178-f4fa-d258-a5f9-fdffb8ec0000/39-minitas-beach-club2.jpg?update-time=1678805410349&size=responsive640",
    "https://img.freepik.com/free-photo/room-interior-hotel-bedroom_23-2150683431.jpg?size=626&ext=jpg&ga=GA1.1.586287953.1715266447&semt=ais_user_b",
    "https://img.freepik.com/free-photo/type-entertainment-complex-popular-resort-with-pools-water-parks-turkey-with-more-than-5-million-visitors-year-amara-dolce-vita-luxury-hotel-resort-tekirova-kemer_146671-18728.jpg",
  ];

  return (
    <div className="pList">
      {loading ? (
        "loading"
      ) : (
        <>
          {data &&
            images.map((img, i) => (
              <div className="pListItem" key={i}>
                <img
                  src={img}
                  alt=""
                  className="pListImg"
                />
                <div className="pListTitles">
                  <h1>{data[i]?.type}</h1>
                  <h2>{data[i]?.count} {data[i]?.type}</h2>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default PropertyList;
//imported from hotelcontroller, hotel, apartment ,resorts, villas
//see hotelcontrollers for type and count being fetched from there to here