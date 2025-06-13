const express = require("express");
const router = express.Router();
const adminPassController = require("../controller/adminPass")


router.get('/', adminPassController.getAdminPass);
router.post('/', adminPassController.postAdminPass);

module.exports = router;