const { sendResponse, queryDatabase } = require("../../utils/common")
const { isCreateCommentPayloadvalid } = require("../../utils/validations")
const { getQuery } = require("../../utils/queries")
const { INVALID_PAYLOAD, CREATE_COMMENT, TICKET_NOT_FOUND } = require("../../utils/constants")

const createComment = async (req, res) => {
    const { user } = req
    const { comment, ticketId } = req.body

    const isPayloadValid = isCreateCommentPayloadvalid(comment, ticketId)
    if (!isPayloadValid) return sendResponse(res, 400, null, INVALID_PAYLOAD)

    try {
        const query = getQuery(CREATE_COMMENT)(comment, user.id, ticketId)
        const response = await queryDatabase(query)
        const data = {
            id: response.insertId,
            comment,
            ticketId
        }
        return sendResponse(res, 201, data)
    } catch (err) {
        if (err?.code.includes("ER_NO_REFERENCED")) return sendResponse(res, 404, null, TICKET_NOT_FOUND)
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    createComment
}