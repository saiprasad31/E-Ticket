const { sendResponse, queryDatabase } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { GET_ALL_PROJECTS, GET_ALL_PROJECTS_BY_ID, INSUFFICIENT_PERSIMISSIONS } = require("../../utils/constants")

const getAllProjects = async (req, res) => {
    const { user } = req
    const permissions = ["all", "project_creation"]
    if (!permissions.includes(user.permissions)) return sendResponse(res, 403, null, INSUFFICIENT_PERSIMISSIONS)
    try {
        const query = user.permissions === "all" ? getQuery(GET_ALL_PROJECTS)() : getQuery(GET_ALL_PROJECTS_BY_ID)(user.id)
        const response = await queryDatabase(query)
        sendResponse(res, 200, response)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    getAllProjects
}