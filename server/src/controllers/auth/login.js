const { isEmpty } = require("lodash")
const { v4: uuid } = require("uuid")
const { queryDatabase, sendResponse, validateEncryptedText, createToken } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { GET_USER_BY_EMAIL, SAVE_TOKEN, INVALID_CREDENTIALS } = require("../../utils/constants")
const { isLoginPayloadValid } = require("../../utils/validations")

const login = async (req, res) => {
    const { email, password } = req.body
    const isPayloadValid = isLoginPayloadValid(email, password)
    if (!isPayloadValid) return sendResponse(res, 401, null, INVALID_CREDENTIALS)
    const query = getQuery(GET_USER_BY_EMAIL)(email)
    try {
        const response = await queryDatabase(query)
        if (isEmpty(response)) return sendResponse(res, 401, null, INVALID_CREDENTIALS)
        const { password: hashedPassword, roleId, email, name, id } = response[0]
        const passwordMatched = await validateEncryptedText(password, hashedPassword)
        if (!passwordMatched) return sendResponse(res, 401, null, INVALID_CREDENTIALS)
        const data = {
            id,
            roleId,
            email,
            name
        }
        const { AUTH_TOKEN_SECRET, AUTH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN } = process.env
        const tokenId = uuid()
        const authToken = createToken(data, AUTH_TOKEN_SECRET, AUTH_TOKEN_EXPIRES_IN, tokenId)
        const refreshToken = createToken(data, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN, tokenId)
        const saveTokenQuery = getQuery(SAVE_TOKEN)(tokenId, id)
        await queryDatabase(saveTokenQuery)
        const user = { ...response[0] }
        delete user.password
        delete user.refreshToken
        delete user.createdAt
        const responseData = { authToken, refreshToken, user }
        return sendResponse(res, 200, responseData)
    } catch (err) {
        return sendResponse(res, 500, null, err)
    }
}

module.exports = { login }