const mongoose = require ('mongoose');
const {Schema} = mongoose;

const RoomSchema = new mongoose.Schema({
    title:{ //room type ex luxurious, delux, family, standard
        type: String,
        required: true,

    },
    price:{
        type: Number,
        required: true,
        
    },
    maxPeople:{
        type: Number,
        required: true,
    },
    desc:{
        type: String,
        required: true
    },
    roomNumbers:[{
        number: Number, //physical room no. of this room type, each object represents one actual room with its availability
        unavailableDates: {type: [Date]} //nobody can book the same room on the same date which have been booked
    }]
},{timestamps:true});

module.exports = mongoose.model("Room", RoomSchema);

/*
 roomNumbers:[
    {
       _id:"RN1",
       number:101,
       unavailableDates:[]
    },
    {
       _id:"RN2",
       number:102,
       unavailableDates:[]
    }
 ]
*/