const { sendResponse, queryDatabase, getCurrentTimeStamp } = require("../../utils/common")
const { isUpdateCommentPayloadvalid } = require("../../utils/validations")
const { getQuery } = require("../../utils/queries")
const { INVALID_PAYLOAD, UPDATE_COMMENT, COMMENT_NOT_FOUND } = require("../../utils/constants")

const updateComment = async (req, res) => {
    const { user } = req
    const { id } = req.params
    const { comment } = req.body

    const isPayloadValid = isUpdateCommentPayloadvalid(comment)
    if (!isPayloadValid) return sendResponse(res, 400, null, INVALID_PAYLOAD)

    try {
        const updatedAt = getCurrentTimeStamp()
        const query = getQuery(UPDATE_COMMENT)(comment, updatedAt, id, user.id)
        const response = await queryDatabase(query)
        if (!response.affectedRows) return sendResponse(res, 404, null, COMMENT_NOT_FOUND)
        return sendResponse(res, 204)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    updateComment
}