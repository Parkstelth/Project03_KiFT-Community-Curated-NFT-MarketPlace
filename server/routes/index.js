var express = require("express");
var router = express.Router();
const User = require("../models/User");

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Wellcome KiFT" });
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
        res.status(200).send("새로운 계정 DB 존재");
      } else {
        res.status(200).send("기존 계정 DB 존재");
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(409).send({ message: e });
    });
});

module.exports = router;
