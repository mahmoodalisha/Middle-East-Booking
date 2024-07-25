//using Common js
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');


const createHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body);

    try {
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    } catch (err) {
        next(err);
    }
};

const updateHotel = async (req, res, next) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedHotel);
    } catch (err) {
        next(err);
    }
};

const deleteHotel = async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json("Hotel deleted");
    } catch (err) {
        next(err);
    }
};

const getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel);
    } catch (err) {
        next(err);
    }
};

const getHotels = async (req, res, next) => {
    const { min, max, limit, featured, ...others } = req.query;
  
    // Convert min and max to numbers, providing defaults if necessary
    const minPrice = parseInt(min, 10) || 1;
    const maxPrice = parseInt(max, 10) || 999;
  
    // Build the query object
    let query = { ...others };
    if (featured) {
      query.featured = featured === 'true'; // Convert the query string to boolean
    }
  
    // Add price range to the query object
    query.cheapestPrice = { $gte: minPrice, $lte: maxPrice };
  
    try {
      // Execute the query with the limit
      const hotels = await Hotel.find(query).limit(parseInt(limit, 10));
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  };
  
//http://localhost:8000/api/hotels?featured=true&limit=2 endpoint for limit of featured hotels, only those hotels marked in the database as true will be shown in featured
//http://localhost:8000/api/hotels?featured=true&limit=2&min=10&max=200 endpoint for min and max price


const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",")  //this is a query for ? and .split is to separate with comma betwwen the cities in the url endpoint
    try {
        const list = await Promise.all(cities.map(city=>{
            return Hotel.countDocuments({city:city})
        }))
        
        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
};



const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },    
    ]);
  } catch (err) {
    next(err);
  }
};

const getHotelRooms = async (req, res, next) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      const list = await Promise.all(
        hotel.rooms.map((room) => {
          return Room.findById(room);
        })
      );
      res.status(200).json(list)
    } catch (err) {
      next(err);
    }
  };


module.exports = {
    createHotel,
    updateHotel,
    deleteHotel,
    getHotel,
    getHotels,
    countByCity,
    countByType,
    getHotelRooms,
};

//It's important to ensure that the city names you provide in the query parameter match the city names stored in your database.
// example endpoint http://localhost:8000/api/hotels/countByCity?cities=dubai,abudhabi,sharjah 
//there should not be any spelling error between cities of database and url endpoint