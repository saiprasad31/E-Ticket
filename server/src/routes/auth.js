const express = require("express")
const router = express.Router()
const { login, logout, getRefreshToken } = require("../controllers/auth")

router.post("/login", login)
router.delete("/logout", logout)
router.post("/refresh", getRefreshToken)

module.exports = router