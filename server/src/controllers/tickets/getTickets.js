const { sendResponse, queryDatabase, removeUnwantedDataFromUser } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { GET_TICKET, GET_TICKETS_PROJECT_ID, TICKET_NOT_FOUND, GET_USER_BY_ID } = require("../../utils/constants")
const { promise } = require("bcrypt/promises")

const getTicketsByProject = async (req, res) => {
    const { id } = req.params
    try {
        const query = getQuery(GET_TICKETS_PROJECT_ID)(id)
        const response = await queryDatabase(query)
        return sendResponse(res, 200, response)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

const getTicket = async (req, res) => {
    const { id } = req.params
    try {
        const query = getQuery(GET_TICKET)(id)
        const response = await queryDatabase(query)
        if (!response.length) return sendResponse(res, 404, null, TICKET_NOT_FOUND)
        const getCreatedByUserQuery = getQuery(GET_USER_BY_ID)(response[0].createdBy)
        const getUpdatedByUserQuery = getQuery(GET_USER_BY_ID)(response[0].lastUpdatedBy)
        const getAssignedToUserQuery = getQuery(GET_USER_BY_ID)(response[0].assignedTo)
        const promises = [queryDatabase(getCreatedByUserQuery), queryDatabase(getUpdatedByUserQuery), queryDatabase(getAssignedToUserQuery)]
        const [createdByUser, updatedByUser, assignedToUser] = await Promise.all(promises)
        const data = {
            ...response[0],
            createdByUser: removeUnwantedDataFromUser(createdByUser[0]),
            updatedByUser: removeUnwantedDataFromUser(updatedByUser[0]),
            assignedToUser: removeUnwantedDataFromUser(assignedToUser[0])
        }
        return sendResponse(res, 200, data)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    getTicketsByProject,
    getTicket
}