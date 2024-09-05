const express = require('express');
const router = express.Router();
const { searchWords, allData } = require('../controllers/treeController');

router.route('/')
    .post(searchWords);
router.route('/alldata')
    .get(allData);

module.exports = router;