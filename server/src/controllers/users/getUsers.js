const { queryDatabase, sendResponse } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { GET_ALL_USERS, GET_USER_BY_ID, INSUFFICIENT_PERSIMISSIONS, USER_NOT_FOUND } = require("../../utils/constants")

const getAllUsers = async (req, res) => {
    try {
        const query = getQuery(GET_ALL_USERS)()
        const response = await queryDatabase(query)
        return sendResponse(res, 200, response)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

const getUser = async (req, res) => {
    const { id } = req.params
    if (req.user.id === parseInt(id)) {
        const response = { ...req.user }
        delete response.password
        delete response.refreshToken
        return sendResponse(res, 200, response)
    } else if (req.user.permissions === "all") {
        const query = getQuery(GET_USER_BY_ID)(id)
        const response = await queryDatabase(query)
        if (!response.length)
            return sendResponse(res, 404, null, USER_NOT_FOUND)
        const modifiedResponse = { ...response[0] }
        delete modifiedResponse.password
        delete modifiedResponse.refreshToken
        return sendResponse(res, 200, modifiedResponse)
    } else {
        return sendResponse(res, 403, null, INSUFFICIENT_PERSIMISSIONS)
    }
}

module.exports = { getAllUsers, getUser }