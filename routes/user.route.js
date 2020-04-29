const express = require("express")
const app = express()
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: './public/uploads/' })

const userController = require('../controller/user.controller');
const userValidate = require('../validates/user.validate');

router.get('/', userController.index);

router.get('/create', userController.create);

router.post('/create', userValidate.userValidate, userController.postCreate);

router.get("/:id/update", userController.update);

router.post("/:id/update", userController.postUpdate);

router.get('/:id/delete', userController.delete);

router.get('/:id/profile', userController.profile);

router.get('/:id/profile/avatar', userController.avatar);

router.post('/:id/profile/avatar', 
            upload.single('avatar'),
            userController.postAvatar);

module.exports = router;

