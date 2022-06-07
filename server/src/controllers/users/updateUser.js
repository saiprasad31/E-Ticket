const { sendResponse, queryDatabase } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { UPDATE_USER, USER_NOT_FOUND, INVALID_PAYLOAD } = require("../../utils/constants")
const { isUpdateUserPayloadValid } = require("../../utils/validations")

const updateUser = async (req, res) => {
    const { id } = req.params
    const { roleId, activeStatus } = req.body
    const isPayloadValid = isUpdateUserPayloadValid(roleId, activeStatus)
    if (!isPayloadValid) return sendResponse(res, 400, null, INVALID_PAYLOAD)
    try {
        const query = getQuery(UPDATE_USER)(roleId, activeStatus, id)
        const response = await queryDatabase(query)
        if (response.affectedRows === 0) return sendResponse(res, 404, null, USER_NOT_FOUND)
        const data = { roleId, activeStatus }
        return sendResponse(res, 200, data)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    updateUser
}