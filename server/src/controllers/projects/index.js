const { createProject } = require("./createProject")
const { getAllProjects } = require("./getProjects")
const { deleteProject } = require("./deleteProject")
const { updateProject } = require("./updateProject")

module.exports = {
    createProject,
    getAllProjects,
    deleteProject,
    updateProject,
}