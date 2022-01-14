var express = require("express");
var router = express.Router();
const User = require("../models/User");
const NFT = require("../models/NFT");
// const { default: Item } = require("../../client/src/component/Item");

/* GET home page. */
router.get("/", function (req, res) {
  res.status(200).send("welcome");
});

router.post("/sign", async (req, res) => {
  // 포스트맨에서 userName, password를 넣으면

  // user에서 find로 userName을 찾고,

  let reqAddress = req.body.loginAddress;

  User.findOne({
    address: reqAddress,
  })
    .then(async (result) => {
      if (!result) {
        const user = new User({
          address: req.body.loginAddress, //주소가 들어가게
          createdAt: new Date(),
          ownedNFTs: [],
        });
        await user.save();
        res.status(200).send("새로운 계정 DB 생성");
      } else {
        res.status(200).send("기존 계정 DB 존재");
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(409).send({ message: e });
    });
});

router.post("/NFT", async (req, res) => {
  let reqContractAddress = req.body.contract_address;
  let reqTokenId = req.body.NFT_Token_id;

  NFT.updateOne(
    {
      contract_address: reqContractAddress,
      NFT_Token_id: reqTokenId,
    },
    {
      isSale: req.body.isSale,
      name: req.body.name,
      contract_address: req.body.contract_address,
      asset_contract_type: req.body.asset_contract_type,
      schema_name: req.body.schema_name,
      description: req.body.description,
      NFT_Token_id: req.body.NFT_Token_id,
      createdAt: req.body.createdAt,
      image_url: req.body.image_url,
      openseaId: req.body.openseaId,
      traits: req.body.traits,
      history: { minted: req.body.history },
    },
    {
      upsert: true,
    }
  )
    .then(async (result) => {
      // const nft = new NFT();
      // await nft.save();
      res.status(200).send({ result: result, message: "maybe good" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.post("/searchNFT", async (req, res) => {
  NFT.findOne({
    openseaId: req.body.openseaId,
  })
    .then(async (result) => {
      if (!result) {
        res.status(404);
      } else {
        res.status(200).send(result);
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(409).send({ message: e });
    });
});

router.post("/regdate", async (req, res) => {
  User.findOne({
    address: req.body.address,
  }).then((result) => {
    if (!result) {
      res.status(200).send("not address");
    } else {
      res.status(200).send(result);
    }
  });
});

module.exports = router;
