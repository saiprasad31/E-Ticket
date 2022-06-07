const { sendResponse, queryDatabase } = require("../../utils/common")
const { isCreateProjectPayloadvalid } = require("../../utils/validations")
const { getQuery } = require("../../utils/queries")
const { INSUFFICIENT_PERSIMISSIONS, INVALID_PAYLOAD, CREATE_PROJECT } = require("../../utils/constants")

const createProject = async (req, res) => {
    const { user } = req
    const { name, description } = req.body
    const permissions = ["all", "project_creation"]
    if (!permissions.includes(user.permissions)) return sendResponse(res, 403, null, INSUFFICIENT_PERSIMISSIONS)

    const isPayloadValid = isCreateProjectPayloadvalid(name, description)
    if (!isPayloadValid) return sendResponse(res, 400, null, INVALID_PAYLOAD)

    try {
        const slug = name.toLowerCase().replace(/ /g, "_")
        const query = getQuery(CREATE_PROJECT)(name, description, user.id, slug)
        const response = await queryDatabase(query)
        const data = {
            id: response.insertId,
            name,
            description,
            slug
        }
        return sendResponse(res, 201, data)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    createProject
}