var express = require('express');
var router = express.Router();
const User = require('../models/User')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Wellcome KiFT' });
});

router.get('/user', async(req,res) => {
  // 포스트맨에서 userName, password를 넣으면


  // user에서 find로 userName을 찾고,
  User.find({
    where: {
      address: 'park'
    }
  })
  .then(async() => {
      const user = new User({
        address : 'jason',
        email : 'asd@naver.com',
        password:'1234'
      })
      await user.save();
      res.status(200).send('OK')
    
  })
})    

module.exports = router;