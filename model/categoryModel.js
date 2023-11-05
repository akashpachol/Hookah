const mongoose = require("mongoose");

const category= new mongoose.Schema({
    category: {
        type: String,
        required: true
    },Availability:{
        type:Number,
        required: true,
    },
    image:{
        type:String,
        required: true,
    },
    categoryAddDate: {
        type: Date,
        default: Date.now, // Store the current date and time when the user is created
      },
});
module.exports=mongoose.model("category",category)