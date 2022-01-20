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
    ProfileURI: {
      type: String,
      default: "https://naver.com",
    },
    TheNumberOfTxTime: {
      type: Number,
      default: 0,
    },
    ownedNFTs: [mongoose.Schema.Types.ObjectId],
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
