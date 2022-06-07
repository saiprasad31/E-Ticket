const { queryDatabase, sendResponse, validateEncryptedText, createToken, encrypt, decodeToken, verifyToken } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { GET_USER_BY_ID, SAVE_TOKEN, INVALID_PAYLOAD, INSUFFICIENT_PERSIMISSIONS, INVALID_TOKEN } = require("../../utils/constants")
const { v4: uuid } = require("uuid")

const getRefreshToken = async (req, res) => {
    const { token, refreshToken } = req.body
    const decodedToken = decodeToken(token)
    const decodedRefreshToken = decodeToken(refreshToken)
    if (!decodedToken || !decodedRefreshToken) return sendResponse(res, 400, null, INVALID_PAYLOAD)
    if (decodedToken.id !== decodedRefreshToken.id) return sendResponse(res, 401, null, INVALID_TOKEN)
    try {
        const tokenData = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        delete tokenData.iat
        delete tokenData.exp
        delete tokenData.jti
        const { AUTH_TOKEN_SECRET, AUTH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN } = process.env


        const getUserQuery = getQuery(GET_USER_BY_ID)(tokenData.id)
        const response = await queryDatabase(getUserQuery)
        if (!response.length) return sendResponse(res, 404, null, USER_NOT_FOUND)
        if (!response[0].refreshToken) return sendResponse(res, 403, null, INSUFFICIENT_PERSIMISSIONS)

        const isValidRefreshToken = response[0].refreshToken && response[0].refreshToken === decodedRefreshToken.jti
        if (!isValidRefreshToken) return sendResponse(res, 403, null, INSUFFICIENT_PERSIMISSIONS)

        const tokenId = uuid()
        const newToken = createToken(tokenData, AUTH_TOKEN_SECRET, AUTH_TOKEN_EXPIRES_IN, tokenId)
        const newRefreshToken = createToken(tokenData, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN, tokenId)
        const saveTokenQuery = getQuery(SAVE_TOKEN)(tokenId, tokenData.id)
        await queryDatabase(saveTokenQuery)
        const data = {
            token: newToken,
            refreshToken: newRefreshToken
        }
        sendResponse(res, 200, data)
    } catch (err) {
        if (err?.name === "TokenExpiredError") return sendResponse(res, 401, null, err)
        return sendResponse(res, 500, null, err)
    }
}

module.exports = {
    getRefreshToken
}