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

  User.findOne({
    address: reqAddress,
  })
    .then(async (result) => {
      res.status(200).send({
        message: "fetching user's address Success",
        data: {
          _id: result._id,
          address: result.address,
          createdAt: result.createdAt,
          points: result.ContributionPoionts,
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
      $addToSet: {
        history: {
          event: "minted",
          date: req.body.createdAt,
          price: " ",
          from: req.body.creator_address,
          to: " ",
        },
      },
    },
    {
      upsert: true,
    }
  )
    .then(async () => {
      await NFT.find({
        contract_address: reqContractAddress,
        NFT_Token_id: reqTokenId,
      })
        .then((result) => {
          return result[0];
        })
        .then(async (result) => {
          await User.findOneAndUpdate(
            { _id: result.owner },
            { $addToSet: { ownedNFTs: result._id } }
          ).then((result) => {
            res.status(200).send(result);
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(401).send(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.post("/searchNFT", (req, res) => {
  NFT.findOne({
    openseaId: req.body.openseaId,
  })
    .populate("owner")
    .then((result, err) => {
      if (err) return res.status(400).send(err);
      res.status(200).send(result);
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

router.get("/fetchItemsOnSale", async (req, res) => {
  NFT.find({ isSale: true })
    .sort({ _id: -1 })
    .then(async (result) => {
      res
        .status(200)
        .send({ message: "fetch listed Items successed!", data: result });
    })
    .catch((err) => {
      res.status(401).send(err);
    });
});
router.post("/listItemOnbuy", async (req, res) => {
  let reqOpenseaId = req.body.openseaId;
  let reqPrice = req.body.price;
  let reqIsSale = req.body.isSale;
  let reqItemIdOnBlockChain = req.body.itemIdOnBlockChain;
  let buyto = req.body.to;
  let buyfrom = req.body.from;
  let buyprice = req.body.itemprice;
  NFT.updateOne(
    {
      openseaId: reqOpenseaId,
    },
    {
      isSale: reqIsSale,
      price: reqPrice,
      itemIdOnBlockChain: reqItemIdOnBlockChain,
      $push: {
        history: {
          event: "buy",
          date: new Date(),
          price: buyprice,
          from: buyfrom,
          to: buyto,
        },
      },
    }
  )
    .then(async (result) => {
      res.status(200).send({
        message: "document successfully changed, listing item succeeded!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.post("/listItemOnlist", async (req, res) => {
  let reqOpenseaId = req.body.openseaId;
  let reqPrice = req.body.price;
  let reqIsSale = req.body.isSale;
  let reqItemIdOnBlockChain = req.body.itemIdOnBlockChain;
  let sellfrom = req.body.from;
  NFT.updateOne(
    {
      openseaId: reqOpenseaId,
    },
    {
      isSale: reqIsSale,
      price: reqPrice,
      itemIdOnBlockChain: reqItemIdOnBlockChain,
      $push: {
        history: {
          event: "list",
          date: new Date(),
          price: reqPrice,
          from: sellfrom,
          to: " ",
        },
      },
    }
  )
    .then(async (result) => {
      res.status(200).send({
        message: "document successfully changed, listing item succeeded!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.post("/listItem", async (req, res) => {
  let reqOpenseaId = req.body.openseaId;
  let reqPrice = req.body.price;
  NFT.updateOne(
    {
      openseaId: reqOpenseaId,
    },
    {
      price: reqPrice,
    }
  )
    .then(async (result) => {
      res.status(200).send({
        message: "This Item Price change Success!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.post("/listItemOncancel", async (req, res) => {
  let reqOpenseaId = req.body.openseaId;
  let reqPrice = req.body.price;
  let reqIsSale = req.body.isSale;
  let reqItemIdOnBlockChain = req.body.itemIdOnBlockChain;
  let cancelfrom = req.body.from;
  NFT.updateOne(
    {
      openseaId: reqOpenseaId,
    },
    {
      isSale: reqIsSale,
      price: reqPrice,
      itemIdOnBlockChain: reqItemIdOnBlockChain,
      $push: {
        history: {
          event: "unlist",
          date: new Date(),
          price: " ",
          from: cancelfrom,
          to: " ",
        },
      },
    }
  )
    .then(async (result) => {
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
      res
        .status(200)
        .send({ message: "Cancle listings request to server successed!" });
    })
    .catch((err) => {
      res.status(401).send(err);
    });
});

router.post("/toGiveContributePoint", async (req, res) => {
  let reqAddress = req.body.address;
  let reqSecondAddress = req.body.secondAddress;
  let reqPoint = req.body.point;

  User.findOneAndUpdate(
    { address: reqAddress },
    { $inc: { ContributionPoionts: reqPoint } }
  )
    .then(() => {
      User.findOne({ address: reqAddress })
        .then((result) => {
          if (reqSecondAddress === null) {
            res
              .status(200)
              .send({ result: result, message: "Sending API Successed!!" });
          }
          return result;
        })
        .then((firstResult) => {
          {
            User.findOneAndUpdate(
              { address: reqSecondAddress },
              { $inc: { ContributionPoionts: reqPoint } }
            ).then(() => {
              User.findOne({ address: reqSecondAddress }).then((result) => {
                res.status(200).send({
                  firstResult: firstResult,
                  secondResult: result,
                  message: "done",
                });
              });
            });
          }
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send({ message: "err!!!", result: err });
    });
});

router.post("/initializePoints", async (req, res) => {
  let reqAddress = req.body.address;

  User.findOneAndUpdate({ address: reqAddress }, { ContributionPoionts: 0 })
    .then(() => {
      User.findOne({ address: reqAddress })
        .then((result) => {
          res
            .status(200)
            .send({ result: result, message: "Initialize points Done!!!" });
        })
        .catch((err) => {
          console.log(err);
          res.status(401).send(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send(err);
    });
});

router.post("/searchItems", async (req, res) => {
  let reqNameOfItem = req.body.nameOfItem;

  NFT.find({ name: { $regex: reqNameOfItem, $options: "i" } })
    .then((result) => {
      if (result[0] === undefined) {
        res.status(201).send({ result: result, message: "it's undefined" });
      } else {
        res.status(200).send({ result: result, message: "searchItems done!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(402).send({ message: "error" });
    });
});

router.post("/changeOwnerAndOwnedNFTs", async (req, res) => {
  let reqBuyerAccount = req.body.address;
  let reqOpenseaId = req.body.openseaId;

  //구매자를 조회하여 오브젝트 아이디 를 가져옵니다
  User.findOne({ address: reqBuyerAccount })
    .then((result) => {
      return result.id;
    })
    .then(async (buyerObjectId) => {
      await NFT.findOne({ openseaId: reqOpenseaId })
        .then((result) => {
          return result;
        })
        .then((itemNFT) => {
          //오브젝트 아이디를 통해 판매자의 소유 NFT배열에서 빼줍니다
          User.findOneAndUpdate(
            { _id: itemNFT.owner },
            { $pull: { ownedNFTs: itemNFT._id } }
          ).then((result) => {});
        });

      //NFT 의 주인을 바꾸고 구매자의 소유 NFT 배열에 넣어줍니다
      await NFT.findOneAndUpdate(
        { openseaId: reqOpenseaId },
        { owner: buyerObjectId }
      )
        .then((result) => {
          return result;
        })
        .then((itemNFT) => {
          User.findOneAndUpdate(
            { address: reqBuyerAccount },
            { $addToSet: { ownedNFTs: itemNFT._id } }
          ).then((result) => {
            res.status(200).send({ result: result, message: "done!!!!" });
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(401)
        .send({ message: "changeOwnerAndOwnedNFTs APIs Failed", result: err });
    });
});
module.exports = router;
