const express = require("express")
const router = express.Router()
const { createTicket, deleteTicket, getTicketsByProject, getTicket, updateTicket } = require("../controllers/tickets")
const { userAuthMiddleware } = require("../middlewares/auth")

router.post("/", userAuthMiddleware, createTicket)
router.delete("/:id", userAuthMiddleware, deleteTicket)
router.get("/project/:id", userAuthMiddleware, getTicketsByProject)
router.get("/:id", userAuthMiddleware, getTicket)
router.patch("/:id", userAuthMiddleware, updateTicket)

module.exports = router