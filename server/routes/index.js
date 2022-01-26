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
          console.log(result);
          console.log(result[0].owner.toString());
          console.log("this is owner object id", req.body.owner);
          return result[0];
        })
        .then(async (result) => {
          console.log(result);
          await User.findOneAndUpdate(
            { _id: result.owner },
            { $addToSet: { ownedNFTs: result._id } }
          ).then((result) => {
            console.log("this is result of NFT api", result);
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
          from: cancelfrom,
          to: " ",
        },
      },
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
      res
        .status(200)
        .send({ message: "Cancle listings request to server successed!" });
    })
    .catch((err) => {
      res.status(401).send(err);
    });
});

router.post("/toGiveContributePoint", async (req, res) => {
  //일단 보류
  let reqAddress = req.body.address;
  let reqSecondAddress = req.body.secondAddress;
  let reqPoint = req.body.point;

  console.log(reqPoint);

  User.findOneAndUpdate(
    { address: reqAddress },
    { $inc: { ContributionPoionts: reqPoint } }
  )
    .then(() => {
      User.findOne({ address: reqAddress })
        .then((result) => {
          console.log(
            "This is result of toGiveContributePoint========>>>>>>",
            result
          );

          if (reqSecondAddress === null) {
            res
              .status(200)
              .send({ result: result, message: "Sending API Successed!!" });
          }
          return result;
        })
        .then((firstResult) => {
          console.log("test====================================");
          console.log(reqSecondAddress);
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

router.post("/buyNFT", async (req, res) => {
  let buyerAddress = req.body.buyerAddress;
});
//추후에 토큰 만들고나서 만들 것
router.post("/claimTokens", async (req, res) => {
  let userAddress = req.body.userAddress;
});

router.post("/searchItems", async (req, res) => {
  let reqNameOfItem = req.body.nameOfItem;

  console.log("seflijsfilsejfsil========", reqNameOfItem);

  //대소문자 구분 없이하려면 $"options" : "i" 추가해야함!
  NFT.find({ name: { $regex: reqNameOfItem, $options: "i" } })
    .then((result) => {
      console.log("this is result========>>>>>>", result[0]);
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
      console.log("this is result-================>>>>>>>>>>>", result.id);
      return result.id;
    })
    .then(async (buyerObjectId) => {
      await NFT.findOne({ openseaId: reqOpenseaId })
        .then((result) => {
          console.log("this is for test result !!! =====>>", result);
          console.log("this is for test owner !!! =====>>", result.owner);
          return result;
        })
        .then((itemNFT) => {
          console.log("itemNFT ================>>>>>>>>>>>>>", itemNFT);
          //오브젝트 아이디를 통해 판매자의 소유 NFT배열에서 빼줍니다
          User.findOneAndUpdate(
            { _id: itemNFT.owner },
            { $pull: { ownedNFTs: itemNFT._id } }
          ).then((result) => {
            console.log(
              "this is result of pulling nft from ownedNFTs!!! ====>>>> ",
              result
            );
          });
        });

      //NFT 의 주인을 바꾸고 구매자의 소유 NFT 배열에 넣어줍니다
      await NFT.findOneAndUpdate(
        { openseaId: reqOpenseaId },
        { owner: buyerObjectId }
      )
        .then((result) => {
          console.log("this is final result!!!===>>> ", result);
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

      /* NFT.findOneAndUpdate({ openseaId: reqOpenseaId }, { owner: buyerObjectId })
        .then((result) => {
          console.log(result._id);

          return result._id;
        })
        .then((objectId) => {
          console.log("this is obejct ID-======>", objectId);
          User.findOneAndUpdate({ address: reqSellerAccount }, { $pull: { ownedNFTs: objectId } }).then((result) => {
            console.log("this is result of changeOwnerAndOwnedNFTs API!!!!=======>>", result);
            res.status(200).send({ message: "message", result: result });
          });
        }); */
    })
    .catch((err) => {
      console.log(err);
      res
        .status(401)
        .send({ message: "changeOwnerAndOwnedNFTs APIs Failed", result: err });
    });
});
module.exports = router;
