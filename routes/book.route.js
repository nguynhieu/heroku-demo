const express = require("express")
const router = express.Router()

const bookController = require('../controller/book.controller');

const authMiddleware = require('../middleware/auth.middleware');

router.get("/", bookController.index);

router.get("/create", bookController.create);

router.post("/create", bookController.postCreate);

router.get("/:id/add", bookController.addToCart);

router.get("/:id/update", bookController.update);

router.post("/:id/update", bookController.postUpdate);

router.get('/:id/delete', bookController.delete);

router.get('/rent', authMiddleware.requireAuth, bookController.rent);

module.exports = router;