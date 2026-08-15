// this List.jsx is for /hotels route
import "./List.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";

const List = () => {
  const apiBase = process.env.REACT_APP_SERVER_URL;
  const location = useLocation();

  const [destination, setDestination] = useState(location.state.destination);
  const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options] = useState(location.state.options);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);

  const { data, loading, error, reFetch } = useFetch(
    `${apiBase}/api/hotels?city=${destination}&min=${min || 0}&max=${max || 999}`
  );

  const handleClick = () => {
    reFetch();
  };

  return (
    <div className="listPage">
      <Navbar />

      <Header type="list" />

      <main className="listContainer">
        <div className="listWrapper">

          {/* SEARCH / FILTER SIDEBAR */}
          <aside className="listSearch">

            <div className="searchHeader">
              <div>
                <h2>Search hotels</h2>
                <p>Find your perfect stay</p>
              </div>
            </div>

            <div className="filterSection">

              <div className="filterItem">
                <label>Destination</label>

                <div className="inputWrapper">
                  <span className="inputIcon">📍</span>

                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where are you going?"
                  />
                </div>
              </div>


              <div className="filterItem">
                <label>Check-in & Check-out</label>

                <div
                  className="dateInput"
                  onClick={() => setOpenDate(!openDate)}
                >
                  <span className="inputIcon">📅</span>

                  <span>
                    {format(dates[0].startDate, "MMM dd, yyyy")} →{" "}
                    {format(dates[0].endDate, "MMM dd, yyyy")}
                  </span>
                </div>

                {openDate && (
                  <div className="listDatePicker">
                    <DateRange
                      onChange={(item) => setDates([item.selection])}
                      minDate={new Date()}
                      ranges={dates}
                    />
                  </div>
                )}
              </div>


              <div className="filterSectionTitle">
                Price per night
              </div>

              <div className="priceInputs">

                <div className="priceInput">
                  <label>Minimum</label>
                  <input
                    type="number"
                    placeholder="₹ 0"
                    onChange={(e) => setMin(e.target.value)}
                  />
                </div>

                <div className="priceInput">
                  <label>Maximum</label>
                  <input
                    type="number"
                    placeholder="₹ 999"
                    onChange={(e) => setMax(e.target.value)}
                  />
                </div>

              </div>


              <div className="filterSectionTitle">
                Guests & rooms
              </div>

              <div className="guestFilters">

                <div className="guestItem">
                  <div>
                    <strong>Adults</strong>
                    <span>12+ years</span>
                  </div>

                  <input
                    type="number"
                    min={1}
                    placeholder={options.adult}
                  />
                </div>


                <div className="guestItem">
                  <div>
                    <strong>Children</strong>
                    <span>0–11 years</span>
                  </div>

                  <input
                    type="number"
                    min={0}
                    placeholder={options.children}
                  />
                </div>


                <div className="guestItem">
                  <div>
                    <strong>Rooms</strong>
                    <span>Number of rooms</span>
                  </div>

                  <input
                    type="number"
                    min={1}
                    placeholder={options.room}
                  />
                </div>

              </div>

            </div>

            <button className="filterSearchButton" onClick={handleClick}>
              Search Hotels
            </button>

          </aside>


          {/* HOTEL RESULTS */}

          <section className="listResult">

            <div className="resultsHeader">
              <div>
                <h1>Hotels in {destination}</h1>

                {!loading && !error && (
                  <p>
                    {data.length} properties available
                  </p>
                )}
              </div>
            </div>


            {loading ? (
              <div className="resultMessage">
                <div className="loader"></div>
                <p>Finding the best hotels for you...</p>
              </div>
            ) : error ? (
              <div className="resultMessage errorMessage">
                <h3>Something went wrong</h3>
                <p>We couldn't load the hotels. Please try again.</p>
              </div>
            ) : (
              <div className="hotelResults">

                {data.map((item) => (
                  <SearchItem
                    item={item}
                    key={item._id}
                  />
                ))}

              </div>
            )}

          </section>

        </div>
      </main>
    </div>
  );
};

export default List;
//type="list" is a prop passed here from Header.jsx in order to remove headerTitle h1, when we are in /hotels route
//in span tag, format is used to import destination,check-in-date to check-out date from search of /home page to /hotels route
//openDate && is a condition if its open
//openDate state to open the dialog box of date
//fetching data to click the search button and fetch hotels after search

//Count by City: http://localhost:8000/api/hotels/countByCity?cities=dubai,abudhabi,sharjah
//Featured Hotels: http://localhost:8000/api/hotels?featured=true&limit=2
//Hotels by Price Range: http://localhost:8000/api/hotels?featured=true&limit=2&min=10&max=200