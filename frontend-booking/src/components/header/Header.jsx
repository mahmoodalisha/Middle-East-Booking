import {
  faCalendarDays,
  faPerson,
  faCheckCircle,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Header.css";

import { DateRange } from "react-date-range";
import { useContext, useState } from "react";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";


const Header = ({ type }) => {

  const [destination, setDestination] = useState("");

  const [openDate, setOpenDate] = useState(false);

  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [openOptions, setOpenOptions] = useState(false);

  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });


  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const { dispatch } = useContext(SearchContext);


  const handleOption = (name, operation) => {

    setOptions((prev) => ({
      ...prev,
      [name]:
        operation === "i"
          ? prev[name] + 1
          : prev[name] - 1,
    }));

  };


  const handleSearch = () => {

    dispatch({
      type: "NEW_SEARCH",
      payload: {
        destination,
        dates,
        options,
      },
    });

    navigate("/hotels", {
      state: {
        destination,
        dates,
        options,
      },
    });

  };


  return (

    <header
      className={
        type === "list"
          ? "header headerListMode"
          : "header"
      }
    >

      <div className="headerContainer">

        {type !== "list" && (

          <>

            {/* HERO CONTENT */}

            <div className="heroContent">

              <div className="heroBadge">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>Trusted by travelers worldwide</span>
              </div>


              <h1 className="heroTitle">
                Find your perfect stay.
              </h1>


              <p className="heroSubtitle">
                Discover exceptional hotels, resorts and stays
                at the best prices across the Middle East.
              </p>


              <div className="heroBenefits">

                <span>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Best price guarantee
                </span>

                <span>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Free cancellation
                </span>

                <span>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Secure booking
                </span>

              </div>

            </div>


            {/* SEARCH CARD */}

            <div className="headerSearch">


              {/* DESTINATION */}

              <div className="headerSearchItem">

                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="headerIcon"
                />

                <div className="searchField">

                  <label>Destination</label>

                  <input
                    type="text"
                    placeholder="Where are you going?"
                    className="headerSearchInput"
                    value={destination}
                    onChange={(e) =>
                      setDestination(e.target.value)
                    }
                  />

                </div>

              </div>


              {/* DATE */}

              <div
                className="headerSearchItem clickable"
                onClick={() => {
                  setOpenDate(!openDate);
                  setOpenOptions(false);
                }}
              >

                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className="headerIcon"
                />

                <div className="searchField">

                  <label>Check-in / Check-out</label>

                  <span className="headerSearchText">
                    {format(
                      dates[0].startDate,
                      "MMM dd"
                    )}
                    {" - "}
                    {format(
                      dates[0].endDate,
                      "MMM dd"
                    )}
                  </span>

                </div>


                {openDate && (

                  <div
                    className="dateWrapper"
                    onClick={(e) => e.stopPropagation()}
                  >

                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) =>
                        setDates([item.selection])
                      }
                      moveRangeOnFirstSelection={false}
                      ranges={dates}
                      minDate={new Date()}
                    />

                  </div>

                )}

              </div>


              {/* GUESTS */}

              <div
                className="headerSearchItem clickable"
                onClick={() => {
                  setOpenOptions(!openOptions);
                  setOpenDate(false);
                }}
              >

                <FontAwesomeIcon
                  icon={faPerson}
                  className="headerIcon"
                />

                <div className="searchField">

                  <label>Guests & Rooms</label>

                  <span className="headerSearchText">

                    {options.adult} adult
                    {options.adult !== 1 ? "s" : ""}

                    {" · "}

                    {options.children} children

                    {" · "}

                    {options.room} room
                    {options.room !== 1 ? "s" : ""}

                  </span>

                </div>


                {openOptions && (

                  <div
                    className="options"
                    onClick={(e) => e.stopPropagation()}
                  >

                    {/* ADULT */}

                    <div className="optionItem">

                      <div>
                        <span className="optionText">
                          Adults
                        </span>

                        <small>
                          Ages 13+
                        </small>
                      </div>

                      <div className="optionCounter">

                        <button
                          disabled={options.adult <= 1}
                          className="optionCounterButton"
                          onClick={() =>
                            handleOption("adult", "d")
                          }
                        >
                          −
                        </button>

                        <span>
                          {options.adult}
                        </span>

                        <button
                          className="optionCounterButton"
                          onClick={() =>
                            handleOption("adult", "i")
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>


                    {/* CHILDREN */}

                    <div className="optionItem">

                      <div>
                        <span className="optionText">
                          Children
                        </span>

                        <small>
                          Ages 0–12
                        </small>
                      </div>

                      <div className="optionCounter">

                        <button
                          disabled={options.children <= 0}
                          className="optionCounterButton"
                          onClick={() =>
                            handleOption("children", "d")
                          }
                        >
                          −
                        </button>

                        <span>
                          {options.children}
                        </span>

                        <button
                          className="optionCounterButton"
                          onClick={() =>
                            handleOption("children", "i")
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>


                    {/* ROOMS */}

                    <div className="optionItem">

                      <div>
                        <span className="optionText">
                          Rooms
                        </span>

                        <small>
                          Number of rooms
                        </small>
                      </div>

                      <div className="optionCounter">

                        <button
                          disabled={options.room <= 1}
                          className="optionCounterButton"
                          onClick={() =>
                            handleOption("room", "d")
                          }
                        >
                          −
                        </button>

                        <span>
                          {options.room}
                        </span>

                        <button
                          className="optionCounterButton"
                          onClick={() =>
                            handleOption("room", "i")
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>

                  </div>

                )}

              </div>


              {/* SEARCH BUTTON */}

              <button
                className="searchButton"
                onClick={handleSearch}
              >
                Search
              </button>

            </div>


            {!user && (

              <button
                className="heroSignIn"
                onClick={() => navigate("/login")}
              >
                Sign in / Register
              </button>

            )}

          </>

        )}

      </div>

    </header>

  );
};

export default Header;