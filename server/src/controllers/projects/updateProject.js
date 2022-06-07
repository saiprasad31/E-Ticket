const { sendResponse, queryDatabase } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { UPDATE_PROJECT, UPDATE_PROJECT_BY_ADMIN, INSUFFICIENT_PERSIMISSIONS, INVALID_PAYLOAD, PROJECT_NOT_FOUND } = require("../../utils/constants")
const { isCreateProjectPayloadvalid } = require("../../utils/validations")

const updateProject = async (req, res) => {
    const { user } = req
    const { id } = req.params
    const { name, description } = req.body
    const permissions = ["all", "project_creation"]
    if (!permissions.includes(user.permissions)) return sendResponse(res, 403, null, INSUFFICIENT_PERSIMISSIONS)

    const isPayloadValid = isCreateProjectPayloadvalid(name, description)
    if (!isPayloadValid) return sendResponse(res, 400, null, INVALID_PAYLOAD)
    try {
        const slug = name.toLowerCase().replace(/ /g, "_")
        const query = user.permissions === "all" ?
            getQuery(UPDATE_PROJECT_BY_ADMIN)(name, description, slug, id) :
            getQuery(UPDATE_PROJECT)(name, description, slug, id, user.id)
        const response = await queryDatabase(query)
        if (response.affectedRows === 0) return sendResponse(res, 404, null, PROJECT_NOT_FOUND)
        const data = { id, name, description, slug }
        return sendResponse(res, 200, data)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    updateProject
}