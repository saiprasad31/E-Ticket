const { sendResponse, queryDatabase } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { DELETE_COMMENT_BY_ADMIN, DELETE_COMMENT, COMMENT_NOT_FOUND } = require("../../utils/constants")

const deleteComment = async (req, res) => {
    const { user } = req
    const { id } = req.params
    const permissions = ["all", "project_creation"]
    try {
        const query = permissions.includes(user.permissions) ?
            getQuery(DELETE_COMMENT_BY_ADMIN)(id) :
            getQuery(DELETE_COMMENT)(id, user.id)
        const response = await queryDatabase(query)
        if (!response.affectedRows) return sendResponse(res, 404, null, COMMENT_NOT_FOUND)
        return sendResponse(res, 204)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    deleteComment
}