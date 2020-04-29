const express = require("express")
const router = express.Router()

const transactionRoute = require('../controller/transaction.controller');

router.get('/', transactionRoute.index);

router.get('/create', transactionRoute.create);

router.post('/create', transactionRoute.postCreate);

module.exports = router;