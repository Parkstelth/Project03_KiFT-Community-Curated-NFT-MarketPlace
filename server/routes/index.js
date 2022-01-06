var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Wellcome KiFT' });
});

router.get('/pos', function(req, res) {
  res.status(200).send('ok')
});



module.exports = router;