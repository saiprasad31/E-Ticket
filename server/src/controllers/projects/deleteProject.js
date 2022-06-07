const { sendResponse, queryDatabase } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { PROJECT_NOT_FOUND, INSUFFICIENT_PERSIMISSIONS, DELETE_PROJECT, DELETE_PROJECT_BY_ADMIN } = require("../../utils/constants")

const deleteProject = async (req, res) => {
    const { user } = req
    const { id } = req.params
    const permissions = ["all", "project_creation"]
    if (!permissions.includes(user.permissions)) return sendResponse(res, 403, null, INSUFFICIENT_PERSIMISSIONS)
    try {
        const query = user.permissions === "all" ? getQuery(DELETE_PROJECT_BY_ADMIN)(id) : getQuery(DELETE_PROJECT)(id, user.id)
        const response = await queryDatabase(query)
        if (response.affectedRows === 0) return sendResponse(res, 404, null, PROJECT_NOT_FOUND)
        return sendResponse(res, 204, null)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    deleteProject
}