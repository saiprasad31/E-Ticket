const { sendResponse, queryDatabase, encrypt, validateEncryptedText } = require("../../utils/common")
const { getQuery } = require("../../utils/queries")
const { UPDATE_PASSWORD, INVALID_PAYLOAD, GET_USER_BY_ID, INVALID_CREDENTIALS } = require("../../utils/constants")
const { isUpdatePasswordPayloadValid } = require("../../utils/validations")

const updatePassword = async (req, res) => {
    const { id } = req.user
    const { oldPassword, newPassword } = req.body
    const isPayloadValid = isUpdatePasswordPayloadValid(oldPassword, newPassword)
    if (!isPayloadValid) return sendResponse(res, 400, null, INVALID_PAYLOAD)

    try {
        const getUserQuery = getQuery(GET_USER_BY_ID)(id)
        const response = await queryDatabase(getUserQuery)
        const isPasswordValid = await validateEncryptedText(oldPassword, response[0].password)
        if (!isPasswordValid) return sendResponse(res, 401, null, INVALID_CREDENTIALS)
        const hashedPassword = await encrypt(newPassword)
        const query = getQuery(UPDATE_PASSWORD)(hashedPassword, id)
        await queryDatabase(query)
        sendResponse(res, 204, null)
    } catch (err) {
        sendResponse(res, 500, null, err)
    }
}

module.exports = {
    updatePassword
}