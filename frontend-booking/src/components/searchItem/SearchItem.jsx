import { Link } from "react-router-dom";
import "./SearchItem.css";

// Used on the /hotels route
const SearchItem = ({ item }) => {
  return (
    <article className="searchItem">

      {/* HOTEL IMAGE */}
      <div className="siImageWrapper">
        <img
          src={item.photos?.[0]}
          alt={item.name}
          className="siImg"
        />
      </div>


      {/* HOTEL INFORMATION */}
      <div className="siDesc">

        <div className="siMainInfo">

          <h2 className="siTitle">
            {item.name}
          </h2>

          <span className="siLocation">
            📍 {item.city}
          </span>

          <span className="siSubtitle">
            Studio Apartments
          </span>

        </div>


        <div className="siFeatures">

          <span className="siFeature">
            ✓ Free cancellation
          </span>

          <span className="siFeature">
            ✓ Breakfast available
          </span>

          {item.desc && (
            <p className="siDescription">
              {item.desc}
            </p>
          )}

        </div>

      </div>


      {/* RATING + PRICE */}
      <div className="siDetails">

        {item.rating && (
          <div className="siRating">

            <div className="siRatingText">
              <span className="siRatingLabel">
                Excellent
              </span>

              <span className="siRatingReviews">
                Highly rated
              </span>
            </div>

            <span className="siRatingScore">
              {item.rating}
            </span>

          </div>
        )}


        <div className="siDetailTexts">

          <span className="siPrice">
            ${item.cheapestPrice}
            <small> / night</small>
          </span>

          <span className="siTaxOp">
            Includes taxes and fees
          </span>

          <Link
            to={`/hotels/${item._id}`}
            className="siCheckLink"
          >
            <button className="siCheckButton">
              See availability
            </button>
          </Link>

        </div>

      </div>

    </article>
  );
};

export default SearchItem;