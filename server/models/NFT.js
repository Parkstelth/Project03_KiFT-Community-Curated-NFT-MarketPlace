const mongoose = require("mongoose");

const NFTSchema = new mongoose.Schema(
    {
        owner: { type: mongoose.Schema.Types.ObjectId },
        isSale: { type: Boolean, default: false },
        price: { type: Number, default: 0 },
        name: { type: String },
        contract_address: { type: String, required: true },
        asset_contract_type: { type: String },
        schema_name: { type: String },
        description: { type: String },
        NFT_id: { type: String },
        createdAt: { type: Date },
        image_url: { type: String },
        traits: {},
        history: {},
    },
    {
        collection: "NFT",
        versionKey: false, //here
    }
);

const NFT = mongoose.model("NFT", NFTSchema);
module.exports = NFT;
