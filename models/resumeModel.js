const mongoose = require("mongoose");

const resumeModel = new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        address: String,
        phone: Number,
        objective: String,
        declare: String,
        linkedin: String,
        github: String,
        dob: String,
        lang: String,
        hobby: String,
        telephone: Number,
        education: [{ type: mongoose.Schema.Types.ObjectId, ref: "education" }],
        // skill: [{ type: mongoose.Schema.Types.ObjectId, ref: "skill" }],
        // project: [{ type: mongoose.Schema.Types.ObjectId, ref: "project" }],
        // experience: [{ type: mongoose.Schema.Types.ObjectId, ref: "experience" }],
        // avatar: {
        //     type: String,
        //     default: "default.png",
        // }
},
        { timestamps: true }

);

const resume = mongoose.model("resume", resumeModel);

module.exports = resume;