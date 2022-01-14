var express = require("express");
var router = express.Router();
const User = require("../models/User");
const NFT = require("../models/NFT");
// const { default: Item } = require("../../client/src/component/Item");

/* GET home page. */
router.get("/", function (req, res) {
    res.status(200).send("welcome");
});

router.get("/user", async (req, res) => {
    // 포스트맨에서 userName, password를 넣으면

    // user에서 find로 userName을 찾고,
    User.find({
        where: {
            address: "park",
        },
    })
        .then(async () => {
            const user = new User({
                address: "jason", //주소가 들어가게
                createdAt: new Date(),
                ownedNFTs: [],
            });
            await user.save();
            res.status(200).send("OK");
        })
        .catch((e) => {
            console.log(e);
            res.status(409).send({ message: e });
        });
});

router.post("/NFT", async (req, res) => {
    NFT.find()
        .then(async () => {
            const nft = new NFT({
                // owner: { type: mongoose.Schema.Types.ObjectId },
                isSale: req.body.isSale,
                name: req.body.name,
                contract_address: req.body.contract_address,
                asset_contract_type: req.body.asset_contract_type,
                schema_name: req.body.schema_name,
                description: req.body.description,
                NFT_id: req.body.NFT_id,
                createdAt: req.body.createdAt,
                image_url: req.body.image_url,
                history: { minted: req.body.history },
            });
            await nft.save();
            res.status(200).send("good");
        })
        .catch((e) => {
            console.log(e);
            res.status(409).send({ message: e });
        });
});

module.exports = router;
