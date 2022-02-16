const mongoose = require("mongoose");

const KlayNFTSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ownerAddress: { type: String }, //
    itemIdOnBlockChain: { type: Number }, //
    isSale: { type: Boolean, default: false }, //
    collectionName: { type: String },
    price: { type: Number, default: 0 },
    openseaId: { type: Number },
    name: { type: String },
    contract_address: { type: String, required: true },
    asset_contract_type: { type: String, default: "non-fungible" },
    tokenUri: { type: String },
    schema_name: { type: String, default: "KIP17" },
    description: { type: String },
    NFT_Token_id: { type: String, required: true },
    transactionHash: { type: String },
    createdAt: { type: Date },
    image_url: { type: String },
    // openseaId: { type: Number },
    traits: [
      {
        trait_type: { type: String },
        value: { type: String },
        display_type: { type: String },
        max_value: { type: String },
        trait_count: { type: String },
      },
    ],
    history: {},
  },
  {
    collection: "KlayNFT",
    versionKey: false, //here
  }
);

const KlayNFT = mongoose.model("KlayNFT", KlayNFTSchema);
module.exports = KlayNFT;
