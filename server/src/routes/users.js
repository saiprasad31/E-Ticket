const express = require("express")
const router = express.Router()

const { getAllUsers, addUser, getUser, deleteUser, updateUser, updatePassword } = require("../controllers/users")
const { adminAuthMiddleware, userAuthMiddleware } = require("../middlewares/auth")

router.get("/", userAuthMiddleware, getAllUsers)
router.get("/:id", userAuthMiddleware, getUser)
router.post("/", adminAuthMiddleware, addUser)
router.delete("/:id", adminAuthMiddleware, deleteUser)
router.patch("/updatePassword", userAuthMiddleware, updatePassword)
router.patch("/:id", adminAuthMiddleware, updateUser)

module.exports = router