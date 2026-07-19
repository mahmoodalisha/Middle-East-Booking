import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./Reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";


//setOpen is a prop so that we would be able to close modal, reservation room again
//fetch rooms of hotelId in here
const Reserve = ({ setOpen, hotelId }) => {
  const apiBase = process.env.REACT_APP_SERVER_URL;
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const { data, loading, error } = useFetch(`${apiBase}/api/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
  const navigate = useNavigate(); 
  const token = localStorage.getItem("token"); 

  if (loading) {
  return <div className="reserve">Loading...</div>;
}

if (error) {
  return <div className="reserve">Something went wrong!</div>;
}
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e, roomNumberValue) => {
  const checked = e.target.checked;
  const roomData = {
    id: e.target.value,
    number: roomNumberValue
  };
  setSelectedRooms((prev) =>
    checked
      ? [...prev, roomData]
      : prev.filter((item) => item.id !== roomData.id)
  );
};


   

  const handleClick = async () => {
    //STEP 1: Log and validate the token before proceeding
    console.log("Sending booking request with token:", token); 

    if (!token) {
    console.warn("JWT token missing — login required.");
    setSuccessMsg("Please log in first.");
    return;
    }
    try {
      // Calculate total amount
      const numNights =
        (new Date(dates[0].endDate) - new Date(dates[0].startDate)) /
        (1000 * 60 * 60 * 24);

      const totalAmount = selectedRooms.reduce((acc, room) => {
        const roomData = data
          .flatMap((item) =>
            item.roomNumbers.map((rn) => ({
              ...rn,
              price: item.price,
            }))
          )
          .find((r) => r._id === room.id);

        return acc + roomData.price * numNights;
      }, 0);

      // STEP 4: Create booking
      await axios.post(
        `${apiBase}/api/bookings`,
        {
          hotelId,
          roomId: selectedRooms.map((room) => room.id),
          roomNumber: selectedRooms.map((room) => room.number),
          startDate: dates[0].startDate,
          endDate: dates[0].endDate,
          totalAmount,
        },
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      setSuccessMsg("Your booking is successful!");

      setTimeout(() => {
        setOpen(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Booking Error:", err.response?.data || err.message);
      setSuccessMsg("Booking failed. Please try again.");
    }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">{item.price}</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room">
                  <label>{roomNumber.number}</label>
                  <input
                  type="checkbox"
                  value={roomNumber._id}
                  onChange={(e) => handleSelect(e, roomNumber.number)}
                  disabled={!isAvailable(roomNumber)}
                  />

                </div>
              ))}
            </div>
          </div>
        ))}
        {successMsg && <div className="successMsg">{successMsg}</div>}
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
//localhost:8000/api/hotels/room/66548bd74993e1d528fb252a  to reserve the rooms of a hotel

