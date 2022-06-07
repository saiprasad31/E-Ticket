const { verifyToken, sendResponse, queryDatabase, decodeToken } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { INVALID_PAYLOAD, DELETE_TOKEN, GET_USER_BY_ID, USER_NOT_FOUND, INSUFFICIENT_PERSIMISSIONS } = require("../../utils/constants")

const logout = async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) return sendResponse(res, 400, null, INVALID_PAYLOAD)
    try {
        const user = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const getUserQuery = getQuery(GET_USER_BY_ID)(user.id)
        const response = await queryDatabase(getUserQuery)
        if (!response.length) return sendResponse(res, 404, null, USER_NOT_FOUND)

        const decodedRefreshToken = decodeToken(refreshToken)

        const isValidToken = response[0].refreshToken && response[0].refreshToken === decodedRefreshToken.jti
        if (!isValidToken) return sendResponse(res, 403, null, INSUFFICIENT_PERSIMISSIONS)

        const query = getQuery(DELETE_TOKEN)(user.id)
        await queryDatabase(query)
        return sendResponse(res, 204, null, null)
    } catch (err) {
        if (err?.name == 'JsonWebTokenError') return sendResponse(res, 401, null, err)
        if (err?.name == 'TokenExpiredError') return sendResponse(res, 403, null, err)
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    logout
}