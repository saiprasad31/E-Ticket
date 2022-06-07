const express = require("express")
const router = express.Router()
const { createComment, deleteComment, getComments, updateComment } = require("../controllers/comments")
const { userAuthMiddleware } = require("../middlewares/auth")

router.post("/", userAuthMiddleware, createComment)
router.delete("/:id", userAuthMiddleware, deleteComment)
router.patch("/:id", userAuthMiddleware, updateComment)
router.get("/ticket/:id", userAuthMiddleware, getComments)

module.exports = router