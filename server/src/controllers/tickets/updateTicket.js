const { sendResponse, queryDatabase, getCurrentTimeStamp } = require("../../utils/common")
const { isUpdateTicketPayloadValid } = require("../../utils/validations")
const { getQuery } = require("../../utils/queries")
const { INSUFFICIENT_PERSIMISSIONS, INVALID_PAYLOAD, UPDATE_TICKET, GET_TICKET, TICKET_NOT_FOUND } = require("../../utils/constants")

const updateTicket = async (req, res) => {
    const { user } = req
    const { id } = req.params
    const { title, description, assignedTo, status } = req.body
    const isPayloadValid = isUpdateTicketPayloadValid(title, description, assignedTo, status)
    if (!isPayloadValid) return sendResponse(res, 400, null, INVALID_PAYLOAD)

    try {
        const getTicketQuery = getQuery(GET_TICKET)(id)
        const ticketDetails = await queryDatabase(getTicketQuery)
        if (!ticketDetails.length) return sendResponse(res, 404, null, TICKET_NOT_FOUND)
        const timeStamp = getCurrentTimeStamp()
        const history = JSON.parse(ticketDetails[0].history)
        history.push(`Updated by ${user.id}`)
        const modifiedHistory = JSON.stringify(history)
        const updateticketQuery = getQuery(UPDATE_TICKET)(title, description, user.id, timeStamp, modifiedHistory, assignedTo, status, id)
        const response = await queryDatabase(updateticketQuery)
        const data = {
            id,
            assignedTo,
            title,
            description,
            status
        }
        return sendResponse(res, 201, data)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    updateTicket
}