const express = require("express")
const router = express.Router()
const { createProject, getAllProjects, deleteProject, updateProject } = require("../controllers/projects")
const { userAuthMiddleware } = require("../middlewares/auth")

router.post("/", userAuthMiddleware, createProject)
router.get("/", userAuthMiddleware, getAllProjects)
router.delete("/:id", userAuthMiddleware, deleteProject)
router.patch("/:id", userAuthMiddleware, updateProject)

module.exports = router