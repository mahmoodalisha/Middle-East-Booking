import "./Hotel.css";
import Navbar from "../../../components/navbar/Navbar";
import Header from "../../../components/header/Header";
import MailList from "../../../components/mailList/MailList";
import Footer from "../../../components/footer/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

import { useContext, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";

import { SearchContext } from "../../../context/SearchContext";
import { AuthContext } from "../../../context/AuthContext";

import Reserve from "../../../components/reserve/Reserve";


const Hotel = () => {

  const apiBase = process.env.REACT_APP_SERVER_URL;

  const location = useLocation();

  // Get hotel ID from /hotels/:id
  const id = location.pathname.split("/")[2];

  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // Fetch hotel data
  const { data, loading, error } = useFetch(
    `${apiBase}/api/hotels/find/${id}`
  );

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const { dates, options } = useContext(SearchContext);


  // =========================================
  // CALCULATE NUMBER OF NIGHTS
  // =========================================

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  function dayDifference(date1, date2) {

    const timeDiff = Math.abs(
      date2.getTime() - date1.getTime()
    );

    const diffDays = Math.ceil(
      timeDiff / MILLISECONDS_PER_DAY
    );

    return diffDays;
  }


  const days =
    dates && dates[0]
      ? dayDifference(
          new Date(dates[0].endDate),
          new Date(dates[0].startDate)
        )
      : 0;


  // =========================================
  // OPEN IMAGE SLIDER
  // =========================================

  const handleOpen = (i) => {

    setSlideNumber(i);

    setOpen(true);
  };


  // =========================================
  // MOVE IMAGE SLIDER
  // =========================================

  const handleMove = (direction) => {

    let newSlideNumber;

    if (direction === "l") {

      newSlideNumber =
        slideNumber === 0
          ? data.photos.length - 1
          : slideNumber - 1;

    } else {

      newSlideNumber =
        slideNumber === data.photos.length - 1
          ? 0
          : slideNumber + 1;

    }

    setSlideNumber(newSlideNumber);
  };


  // =========================================
  // RESERVE BUTTON
  // =========================================

  const handleClick = () => {

    if (user) {

      setOpenModal(true);

    } else {

      navigate("/login");

    }
  };


  return (

    <div>

      <Navbar />

      <Header type="list" />


      {/* =========================================
          LOADING
      ========================================= */}

      {loading ? (

        <div className="loading">
          Loading...
        </div>


      ) : error ? (

        <div className="error">
          Something went wrong. Please try again.
        </div>


      ) : (

        <div className="hotelContainer">


          {/* =========================================
              IMAGE SLIDER
          ========================================= */}

          {open && (

            <div className="slider">

              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />


              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />


              <div className="sliderWrapper">

                <img
                  src={data.photos[slideNumber]}
                  alt={data.name}
                  className="sliderImg"
                />

              </div>


              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />

            </div>

          )}


          {/* =========================================
              HOTEL WRAPPER
          ========================================= */}

          <div className="hotelWrapper">


            {/* TOP RESERVE BUTTON */}

            <button
              className="bookNow"
              onClick={handleClick}
            >
              Reserve or Book Now!
            </button>


            {/* HOTEL NAME */}

            <h1 className="hotelTitle">
              {data.name}
            </h1>


            {/* ADDRESS */}

            <div className="hotelAddress">

              <FontAwesomeIcon
                icon={faLocationDot}
              />

              <span>
                {data.address}
              </span>

            </div>


            {/* DISTANCE */}

            <span className="hotelDistance">

              Excellent location – {data.distance}m from center

            </span>


            {/* PRICE HIGHLIGHT */}

            <span className="hotelPriceHighlight">

              Book a stay over ${data.cheapestPrice} at this property and get a
              free airport taxi

            </span>


            {/* =========================================
                MAIN CONTENT
                IMAGE GALLERY + PRICE CARD
            ========================================= */}

            <div className="hotelMainContent">


              {/* =========================================
                  IMAGE GALLERY
              ========================================= */}

              <div className="hotelImages">

                {data.photos?.map((photo, i) => (

                  <div
                    className="hotelImgWrapper"
                    key={i}
                  >

                    <img
                      onClick={() => handleOpen(i)}
                      src={photo}
                      alt={data.name}
                      className="hotelImg"
                    />

                  </div>

                ))}

              </div>


              {/* =========================================
                  PRICE CARD
              ========================================= */}

              <div className="hotelDetailsPrice">


                <div className="priceCardHeader">

                  <span>
                    Perfect for a {days}-night stay!
                  </span>

                </div>


                <div className="priceCardInfo">

                  <span className="priceLabel">
                    Total price
                  </span>


                  <h2>
                    ${days * data.cheapestPrice * options.room}
                  </h2>


                  <span className="priceSubtext">

                    {days}

                    {" "}

                    {days === 1 ? "night" : "nights"}

                    {" · "}

                    {options.room}

                    {" "}

                    {options.room === 1 ? "room" : "rooms"}

                  </span>

                </div>


                <button
                  onClick={handleClick}
                  className="reserveButton"
                >
                  Reserve or Book Now!
                </button>


              </div>

            </div>


            {/* =========================================
                HOTEL DESCRIPTION
            ========================================= */}

            <div className="hotelDescription">

              <h2>
                {data.title}
              </h2>


              <p>
                {data.desc}
              </p>

            </div>


          </div>


          {/* =========================================
              MAIL LIST
          ========================================= */}

          <MailList />


          {/* =========================================
              FOOTER
          ========================================= */}

          <Footer />


        </div>

      )}


      {/* =========================================
          RESERVATION MODAL
      ========================================= */}

      {openModal && (

        <Reserve
          setOpen={setOpenModal}
          hotelId={id}
        />

      )}

    </div>

  );
};


export default Hotel;