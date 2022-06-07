const { createTicket } = require("./createTicket")
const { deleteTicket } = require("./deleteTicket")
const { getTicketsByProject, getTicket } = require("./getTickets")
const { updateTicket } = require("./updateTicket")

module.exports = {
    createTicket,
    deleteTicket,
    getTicketsByProject,
    getTicket,
    updateTicket,
}