const { sendResponse, queryDatabase } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { isCreateCommentPayloadvalid } = require("../../utils/validations")
const { GET_COMMENTS, COMMENT_NOT_FOUND } = require("../../utils/constants")

const getComments = async (req, res) => {
    const { id: ticketId } = req.params
    try {
        const query = getQuery(GET_COMMENTS)(ticketId)
        const response = await queryDatabase(query)
        return sendResponse(res, 200, response)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    getComments
}