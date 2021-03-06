var express = require("express");
var router = express.Router();
const User = require("../models/User");
const NFT = require("../models/NFT");
const KlayNFT = require("../models/KlayNFT");
const CaverExtKAS = require("caver-js-ext-kas");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const axios = require("axios");

//카스 테스트
const accessKeyId = "KASKGXY61FBDCS5DG3H4X9QF";
const secretAccessKey = "fdQtUVnPBvQRKHc2h5JnixThYZ_kKKasdM8zIMRk";
const chainId = 1001;

const caver = new CaverExtKAS();
caver.initKASAPI(chainId, accessKeyId, secretAccessKey);
//

router.get("/", function (req, res) {
  res.status(200).send("welcome");
});

router.post("/crolling", async function (req, res) {
  //KIP-17의 보유 nft를 컨트랙트 주소를 모두 가져오기 위해 크롤링을 한다.
  // 브라우저를 실행한다.
  // 옵션으로 headless모드를 끌 수 있다.
  let account = req.body.account;
  const browser = await puppeteer.launch({
    headless: true, //가상웹을 띄우지 않고 back에서 처리
  });

  // 새로운 페이지를 연다.
  const page = await browser.newPage();
  // 페이지의 크기를 설정한다.

  await page.goto(`https://baobab.scope.klaytn.com/account/${account}?tabId=kip17Balance`); //해당 웹으로 이동
  //

  try {
    await page.waitForSelector(
      "#root > div > div.SidebarTemplate > div.SidebarTemplate__main > div > div > div.DetailPageTableTemplate > div > div.Tab__content > section > article.TokenBalancesList__body > div > div.Table__tbody"
    ); //해당하는 셀럭터가 다만들어질때 까지 대기

    const content = await page.content(); //html 소스 추출
    let list = [];
    const $ = cheerio.load(content); //추출된 소스를 다시 html형식으로
    const $bodyList = $(
      "div.Table__td.TokenBalancesListDesktop.TokenBalancesListDesktop__kip17-balance__name.TokenBalancesListDesktop.TokenBalancesListDesktop__kip17-balance__nameTd > a"
    ); //셀럭터 검색으로 queryselectorAll과 같은기능
    for (let i = 0; i < $bodyList.length; i++) {
      list.push($bodyList[i].attribs.href.slice(5));
    }
    await browser.close();
    res.status(200).send(list);
  } catch (e) {
    await browser.close();
    res.status(200).send("false");
  }
});

router.post("/fetchNFT", async (req, res) => {
  // KIP-17 소유 NFT를 DB에 모두 저장시킨다.
  //결과로 유저의 정보 빼와줌
  let reqOwnerAddress = req.body.ownerAddress;
  let mintedDate;
  let thisContract = req.body.thisContract;
  const contractAddress = thisContract;
  const query = {
    size: 100,
  };
  const result = caver.kas.tokenHistory.getNFTListByOwner(contractAddress, reqOwnerAddress, query);

  result
    .then((result) => {
      result.items.map((item) => {
        let randomNum = Math.floor(Math.random() * 10000000);
        mintedDate = new Date(item.createdAt * 1000);
        KlayNFT.findOneAndUpdate(
          //있으면 무시 없으면 새로 생성
          {
            NFT_Token_id: item.tokenId,
            contract_address: contractAddress,
          },
          {
            ownerAddress: reqOwnerAddress,
            NFT_Token_id: item.tokenId,
            tokenUri: item.tokenUri,
            transactionHash: item.transacitonHash,
            createdAt: new Date(item.createdAt * 1000),
            openseaId: randomNum,
          },
          {
            upsert: true,
          }
        ).then((result) => {});
        //URI들어가서 정보빼오기
        User.findOne({ address: reqOwnerAddress }).then(async (owner) => {
          if (item.tokenUri.slice(0, 4) === "http") {
            await axios.get(item.tokenUri).then(async (result) => {
              await KlayNFT.findOneAndUpdate(
                //히스토리에 minted로 기록
                { NFT_Token_id: item.tokenId, contract_address: contractAddress, history: null },
                {
                  $addToSet: {
                    history: {
                      event: "minted",
                      date: mintedDate,
                      price: "",
                      from: "",
                      to: reqOwnerAddress,
                    },
                  },
                }
              );

              await KlayNFT.findOneAndUpdate(
                { NFT_Token_id: item.tokenId, contract_address: contractAddress },
                {
                  name: result.data.name,
                  collection: result.data.collection,
                  description: result.data.description,
                  image_url: result.data.image,
                  traits: result.data.attributes,
                  owner: owner._id,
                  /* $addToSet: {
                    history: {
                      event: "minted",
                      date: mintedDate, //어떻게 해야할지 모르겠어서 일단 이렇게 해둠
                      price: "",
                      from: "",
                      to: reqOwnerAddress,
                    },
                  }, */
                }
              ).then((result) => {
                User.findOneAndUpdate({ address: reqOwnerAddress }, { $addToSet: { ownedNFTs: result._id } }).then((result) => {});
              });
            });
          } else if (item.tokenUri.slice(0, 7) === "ipfs://") {
            //불러온 nft의 tokenURI에 따라 제어한다.
            await axios.get(`https://ipfs.io/ipfs/${item.tokenUri.slice(7)}`).then(async (result) => {
              await KlayNFT.findOneAndUpdate(
                { NFT_Token_id: item.tokenId, contract_address: contractAddress, history: null },
                {
                  $addToSet: {
                    history: {
                      event: "minted",
                      date: mintedDate,
                      price: "",
                      from: "",
                      to: reqOwnerAddress,
                    },
                  },
                }
              );

              await KlayNFT.findOneAndUpdate(
                { NFT_Token_id: item.tokenId, contract_address: contractAddress },
                {
                  name: result.data.name,
                  collection: result.data.collection,
                  description: result.data.description,
                  image_url: `https://ipfs.io/ipfs/${result.data.image.slice(7)}`, //
                  traits: result.data.attributes,
                  owner: owner._id,
                  $addToSet: {
                    history: {
                      event: "minted",
                      date: mintedDate, //어떻게 해야할지 모르겠어서 일단 이렇게 해둠
                      price: "",
                      from: "",
                      to: reqOwnerAddress,
                    },
                  },
                }
              ).then((result) => {
                User.findOneAndUpdate({ address: reqOwnerAddress }, { $addToSet: { ownedNFTs: result._id } }).then((result) => {});
              });
            });
          }
        });
      });
      User.findOne({ address: reqOwnerAddress })
        .populate("ownedNFTs")
        .then((result) => {
          res.status(200).send({
            result: result,
            message: "adding NFTs to ownedNFTs in user DB",
          });
        })
        .catch((err) => {
          res.status(401).send({ result: err, message: "something's wrong" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send({ result: err, message: "something's wrong" });
    });
});

router.post("/searchNFT", async (req, res) => {
  //KIP-17로 DB에 저장된 NFT를 검색하여 응답
  KlayNFT.findOne({ openseaId: req.body.openseaId })
    .populate("owner")
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send({ result: err, message: "done" });
    });
});

router.post("/sign", async (req, res) => {
  //카이카스로 SIGN 페이지에서 접속하거나 새롭게 DB에 유저계정 저장시 응답
  let reqAddress = req.body.address;

  User.findOne({
    address: reqAddress,
  })
    .then((result) => {
      if (!result) {
        const user = new User({
          address: reqAddress,
          createdAt: new Date(),
          Chain: "baobab",
          ownedNFTs: [],
        });
        user.save();
        res.status(200).send("새로운 계정 DB 생성");
      } else {
        res.status(208).send("기존 계정 DB 존재");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(409).send({ message: e });
    });
});

router.post("/listItemOnlist", async (req, res) => {
  //리스팅 기록을 히스토리에 저장
  let reqOpenseaId = req.body.openseaId;
  let reqPrice = req.body.price;
  let reqIsSale = req.body.isSale;
  let reqItemIdOnBlockChain = req.body.itemIdOnBlockChain;
  let sellfrom = req.body.from;
  KlayNFT.updateOne(
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

router.post("/listItemOnchange", async (req, res) => {
  //가격변경기록을 히스토리에 저장
  let reqOpenseaId = req.body.openseaId;
  let reqPrice = req.body.price;
  let changefrom = req.body.from;
  KlayNFT.updateOne(
    {
      openseaId: reqOpenseaId,
    },
    {
      price: reqPrice,
      $push: {
        history: {
          event: "PriceChange",
          date: new Date(),
          price: reqPrice,
          from: changefrom,
          to: " ",
        },
      },
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
  //언리스팅 기록을 히스토리에 저장
  let reqOpenseaId = req.body.openseaId;
  let reqPrice = req.body.price;
  let reqIsSale = req.body.isSale;
  let reqItemIdOnBlockChain = req.body.itemIdOnBlockChain;
  let cancelfrom = req.body.from;
  KlayNFT.updateOne(
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

router.post("/listItemOnbuy", async (req, res) => {
  //구매기록을 히스토리에 저장
  let reqOpenseaId = req.body.openseaId;
  let reqPrice = req.body.price;
  let reqIsSale = req.body.isSale;
  let reqItemIdOnBlockChain = req.body.itemIdOnBlockChain;
  let buyto = req.body.to;
  let buyfrom = req.body.from;
  let buyprice = req.body.itemprice;
  KlayNFT.updateOne(
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

router.post("/listItemOntransfer", async (req, res) => {
  // 전송 기록을 히스토리에 저장
  let reqOpenseaId = req.body.openseaId;
  let reqfrom = req.body.from;
  let reqto = req.body.to;

  KlayNFT.updateOne(
    {
      openseaId: reqOpenseaId,
    },
    {
      price: 0,
      isSale: false,
      itemIdOnBlockChain: null,
      $push: {
        history: {
          event: "Transfer",
          date: new Date(),
          price: " ",
          from: reqfrom,
          to: reqto,
        },
      },
    }
  )
    .then(async (result) => {
      res.status(200).send({
        message: "This NFT Item transfer Success!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.post("/changeOwnerAndOwnedNFTs", async (req, res) => {
  //NFT 소유 주인을 DB에서 변경
  let reqBuyerAccount = req.body.address;
  let reqOpenseaId = req.body.openseaId;

  //구매자를 조회하여 오브젝트 아이디 를 가져옵니다
  User.findOne({ address: reqBuyerAccount })
    .then((result) => {
      return result.id;
    })
    .then(async (buyerObjectId) => {
      await KlayNFT.findOne({ openseaId: reqOpenseaId })
        .then((result) => {
          return result;
        })
        .then((itemNFT) => {
          //오브젝트 아이디를 통해 판매자의 소유 NFT배열에서 빼줍니다
          User.findOneAndUpdate({ _id: itemNFT.owner }, { $pull: { ownedNFTs: itemNFT._id } }).then((result) => {});
        });

      //NFT 의 주인을 바꾸고 구매자의 소유 NFT 배열에 넣어줍니다
      await KlayNFT.findOneAndUpdate({ openseaId: reqOpenseaId }, { owner: buyerObjectId })
        .then((result) => {
          return result;
        })
        .then((itemNFT) => {
          User.findOneAndUpdate({ address: reqBuyerAccount }, { $addToSet: { ownedNFTs: itemNFT._id } }).then((result) => {
            res.status(200).send({ result: result, message: "done!!!!" });
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send({ message: "changeOwnerAndOwnedNFTs APIs Failed", result: err });
    });
});

router.get("/fetchItemsOnSale", async (req, res) => {
  //DB에 저장된 KIP-17 NFT의 판매중으로 변경
  KlayNFT.find({ isSale: true })
    .sort({ _id: 1 })
    .then(async (result) => {
      res.status(200).send({ message: "fetch listed Items Successed!", data: result });
      console.log(result, "succeeded!");
    })
    .catch((err) => {
      res.status(401).send(err);
    });
});

module.exports = router;
