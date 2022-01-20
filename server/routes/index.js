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

router.post("/findUser", async (req, res) => {
  let reqAddress = req.body.address;
  console.log("this is reqAddress =====> ", reqAddress);

  User.findOne({
    address: reqAddress,
  })
    .then(async (result) => {
      console.log("this is result._id", result._id);
      console.log("this is result.address", result.address);
      res.status(200).send({
        message: "fetching user's address Success",
        data: {
          _id: result._id,
          address: result.address,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send({
        message: "something has problem",
        data: err,
      });
    });
});

//NFT를 업데이트하거나 생성하고 find method를 이용하여 데이터를 받아온 다음(objectId)
//user의 ownedNFTs 배열에 넣어주려고 함
router.post("/NFT", async (req, res) => {
  let reqContractAddress = req.body.contract_address;
  let reqTokenId = req.body.NFT_Token_id;

  NFT.updateOne(
    {
      contract_address: reqContractAddress,
      NFT_Token_id: reqTokenId,
    },
    {
      owner: req.body.owner,
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
    .then(async () => {
      await NFT.find({ contract_address: reqContractAddress, NFT_Token_id: reqTokenId })
        .then((result) => {
          console.log(result);
          console.log(result[0].owner.toString());
          console.log("this is owner object id", req.body.owner);
          return result[0];
        })
        .then(async (result) => {
          console.log(result);
          await User.findOneAndUpdate({ _id: result.owner }, { $addToSet: { ownedNFTs: result._id } }).then(console.log);
        });
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
    .populate("owner")
    .then((result, err) => {
      if (err) return res.status(400).send(err);
      console.log(result);
      res.status(200).send(result);
    });
  /*

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
        }); */
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

router.get("/fetchItemsOnSale", async (req, res) => {
  NFT.find({ isSale: true })
    .then(async (result) => {
      res.status(200).send({ message: "fetch listed Items successed!", data: result });
    })
    .catch((err) => {
      res.status(401).send(err);
    });
});

router.post("/listItem", async (req, res) => {
  let reqOpenseaId = req.body.openseaId;
  let reqPrice = req.body.price;
  let reqIsSale = req.body.isSale;
  let reqItemIdOnBlockChain = req.body.itemIdOnBlockChain;

  NFT.updateOne(
    {
      openseaId: reqOpenseaId,
    },
    {
      isSale: reqIsSale,
      price: reqPrice,
      itemIdOnBlockChain: reqItemIdOnBlockChain,
    } //옵션으로 upsert는 안써도 됨. 이미 존재하는걸 수정하는거니까
  )
    .then(async (result) => {
      // const nft = new NFT();
      // await nft.save();
      console.log(result);
      res.status(200).send({
        message: "document successfully changed, listing item succeeded!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.post("/cancleListings", async (req, res) => {
  //테스트 아직 안해봄
  let reqOpenseaId = req.body.openseaId;

  NFT.updateOne(
    {
      openseaId: reqOpenseaId,
    },
    {
      isSale: false,
      price: 0,
    }
  )
    .then(async (result) => {
      res.status(200).send({ message: "Cancle listings request to server successed!" });
    })
    .catch((err) => {
      res.status(401).send(err);
    });
});

router.post("buyNFT", async (req, res) => {
  let buyerAddress = req.body.buyerAddress;
});
//추후에 토큰 만들고나서 만들 것
router.post("claimTokens", async (req, res) => {
  let userAddress = req.body.userAddress;
});
module.exports = router;
