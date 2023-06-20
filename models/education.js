const mongoose = require("mongoose");

const Education = new mongoose.Schema({
    degree:String,
    college:String,
    year:Number,
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "resume" },
})



const education = mongoose.model("education", Education);

module.exports = education;