const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true,
        index: true,
        lowercase: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    profile: {
        type: String,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    about: {
        type: String
    },
    role: {
        type: Number,
        trim: true,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    resetPasswordLink: {
        data: String,
        default: ""
    }
}, {
    timestamps: true
});

userSchema.methods = {
    makeSalt: async function () {
        return await bcrypt.genSalt(10);
    },

    authenticate: async function (plainPassword) {
        // true or false
        return await bcrypt.compare(plainPassword, this.hashed_password);
    },

    encryptPassword: async function (password) {
        if (!password) return "";
        return await bcrypt.hash(password, this.salt);
    },

    generateAuthToken: function () {
        const token = jwt.sign({
            _id: this._id
        }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        return token;
    }
};

// makeSalt --> encryptPassword
// authenticate --> generateAuthToken
const User = mongoose.model("User", userSchema);

module.exports = {
    User
};