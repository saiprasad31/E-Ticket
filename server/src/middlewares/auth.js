const { sendResponse, verifyToken, queryDatabase } = require("../utils/common")
const { getQuery } = require("../utils/queries")
const {
    AUTH_TOKEN_MISSING,
    GET_USER_BY_ID,
    INSUFFICIENT_PERSIMISSIONS,
    USER_NOT_FOUND,
} = require("../utils/constants")

const adminAuthMiddleware = async (req, res, next) => {
    const authToken = req.headers["authorization"]
    if (!authToken) return sendResponse(res, 401, null, AUTH_TOKEN_MISSING)
    try {
        const token = authToken.split(" ")[1]
        const data = verifyToken(token, process.env.AUTH_TOKEN_SECRET)
        try {
            const query = getQuery(GET_USER_BY_ID)(data.id)
            const response = await queryDatabase(query)
            if (!response.length || response[0].permissions !== "all")
                return sendResponse(res, 403, null, INSUFFICIENT_PERSIMISSIONS)
            next()
        } catch (err) {
            return sendResponse(res, 500, null, err)
        }
    } catch (err) {
        if (err.name == "TokenExpiredError") return sendResponse(res, 403, null, err)
        return sendResponse(res, 401, null, err)
    }
}

const userAuthMiddleware = async (req, res, next) => {
    const authToken = req.headers["authorization"]
    if (!authToken) return sendResponse(res, 401, null, AUTH_TOKEN_MISSING)
    try {
        const token = authToken.split(" ")[1]
        const data = verifyToken(token, process.env.AUTH_TOKEN_SECRET)
        try {
            const query = getQuery(GET_USER_BY_ID)(data.id)
            const response = await queryDatabase(query)
            if (!response.length)
                return sendResponse(res, 404, null, USER_NOT_FOUND)
            req.user = response[0]
            next()
        } catch (err) {
            return sendResponse(res, 500, null, err)
        }
    } catch (err) {
        if (err.name == "TokenExpiredError") return sendResponse(res, 403, null, err)
        return sendResponse(res, 401, null, err)
    }
}

module.exports = {
    adminAuthMiddleware,
    userAuthMiddleware,
}