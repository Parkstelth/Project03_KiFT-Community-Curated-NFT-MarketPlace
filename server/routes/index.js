var express = require("express");
var router = express.Router();
const User = require("../models/User");

/* GET home page. */
router.get("/", function (req, res) {
    res.render("index", { title: "Wellcome KiFT" });
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
                address: req.body.something, //주소가 들어가게
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

module.exports = router;
