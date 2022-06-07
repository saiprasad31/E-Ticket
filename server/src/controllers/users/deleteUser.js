const { queryDatabase, sendResponse } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { DELETE_USER, USER_NOT_FOUND } = require("../../utils/constants")

const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const query = getQuery(DELETE_USER)(id)
        const response = await queryDatabase(query)
        if (response.affectedRows === 0) return sendResponse(res, 404, null, USER_NOT_FOUND)
        const data = { id }
        return sendResponse(res, 200, data)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }

}

module.exports = {
    deleteUser
}