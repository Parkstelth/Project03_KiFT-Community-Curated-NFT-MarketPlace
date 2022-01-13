const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    ownedNFTs: [],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
