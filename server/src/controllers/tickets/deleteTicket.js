const { sendResponse, queryDatabase } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { INSUFFICIENT_PERSIMISSIONS, INVALID_PAYLOAD, DELETE_TICKET, DELETE_TICKET_BY_ADMIN, PROJECT_NOT_FOUND } = require("../../utils/constants")

const deleteTicket = async (req, res) => {
    const { user } = req
    const { id } = req.params
    const permissions = ["all", "project_creation", "ticket_creation"]
    if (!permissions.includes(user.permissions)) return sendResponse(res, 403, null, INSUFFICIENT_PERSIMISSIONS)

    try {
        const query = user.permissions === "ticket_creation" ? getQuery(DELETE_TICKET)(id, user.id) : getQuery(DELETE_TICKET_BY_ADMIN)(id)
        const response = await queryDatabase(query)
        if (response.affectedRows === 0) return sendResponse(res, 404, null, PROJECT_NOT_FOUND)
        return sendResponse(res, 204, null)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    deleteTicket
}