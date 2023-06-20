const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        name: String,
        email: String,
        code: Number,
        address: String,
        phone: Number,
        objective: String,
        declare: String,
        linkedin: String,
        github: String,
        dob: String,
        lang: String,
        hobby: String,
        avatar: {
            type: String,
            default: "dummy.png",
        },
        education: {
            type: Array,
            default: [],
        },
        skill: {
            type: Array,
            default: [],
        },
        project: {
            type: Array,
            default: [],
        },
        experience: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

userSchema.plugin(plm);

const user = mongoose.model("user", userSchema);

module.exports = user;
