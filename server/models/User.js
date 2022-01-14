const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now, //이렇게도 할 수있더라구요
        },
        ownedNFTs: [mongoose.Schema.Types.ObjectId],
    },
    {
        versionKey: false,
    }
);

const User = mongoose.model("apple", userSchema);
module.exports = User;
