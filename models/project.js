const mongoose = require("mongoose");

const Project = new mongoose.Schema({
    title:String,
    technology:String,
    description:Number,
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "resume" },
})

const project = mongoose.model("project", Project);

module.exports = project;