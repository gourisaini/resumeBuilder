const mongoose = require("mongoose");

const Experience = new mongoose.Schema({
    work:String,
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "resume" },
})

const experience = mongoose.model("experience", Experience);

module.exports = experience;