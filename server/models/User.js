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
    Chain: {
      type: String,
    },
    ContributionPoionts: {
      type: Number,
      default: 0,
    },
    ownedNFTs: [{ type: mongoose.Schema.Types.ObjectId, ref: "KlayNFT" }],
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
