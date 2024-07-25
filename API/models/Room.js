const mongoose = require ('mongoose');
const {Schema} = mongoose;

const RoomSchema = new mongoose.Schema({
    title:{
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
        number: Number,         //this roomNumber contains the info of all the title, price, maxpeople,desc
        unavailableDates: {type: [Date]}   //nobody can book the same room on the same date which have been booked
    }]
},{timestamps:true});

module.exports = mongoose.model("Room", RoomSchema);