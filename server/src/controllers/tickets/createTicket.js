const { sendResponse, queryDatabase, getCurrentTimeStamp } = require("../../utils/common")
const { isCreateTicketPayloadValid } = require("../../utils/validations")
const { getQuery } = require("../../utils/queries")
const { INSUFFICIENT_PERSIMISSIONS, INVALID_PAYLOAD, CREATE_TICKET, GET_PROJECT, PROJECT_NOT_FOUND } = require("../../utils/constants")

const createTicket = async (req, res) => {
    const { user } = req
    const { title, description, projectId, assignedTo } = req.body
    const permissions = ["all", "project_creation", "ticket_creation"]
    if (!permissions.includes(user.permissions)) return sendResponse(res, 403, null, INSUFFICIENT_PERSIMISSIONS)
    const isPayloadValid = isCreateTicketPayloadValid(title, description, projectId, assignedTo)
    if (!isPayloadValid) return sendResponse(res, 400, null, INVALID_PAYLOAD)

    try {
        const getProjectQuery = getQuery(GET_PROJECT)(projectId)
        const projectDetails = await queryDatabase(getProjectQuery)
        if (!projectDetails.length || !projectDetails[0].id) return sendResponse(res, 404, null, PROJECT_NOT_FOUND)
        const ticket_number = `${projectDetails[0].project_name.split(" ")[0].toUpperCase().slice(0, 5)}_${projectDetails[0].count + 1}`
        const timeStamp = getCurrentTimeStamp()
        const history = JSON.stringify([`Created by ${user.id}`])
        const createticketQuery = getQuery(CREATE_TICKET)(ticket_number, title, description, user.id, projectId, user.id, timeStamp, history, assignedTo)
        const response = await queryDatabase(createticketQuery)
        const data = {
            id: response.insertId,
            ticket_number,
            projectId,
            assignedTo,
        }
        return sendResponse(res, 201, data)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    createTicket
}