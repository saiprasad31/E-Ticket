const { sendResponse, encrypt, generatePassword, queryDatabase } = require("../../utils/common")
const { isAddUserPayloadValid } = require("../../utils/validations")
const { getQuery } = require("../../utils/queries")
const { INSERT_USER } = require("../../utils/constants")

const addUser = async (req, res) => {
    const { name, email, roleId } = req.body
    const isValid = isAddUserPayloadValid(name, email, roleId)
    if (!isValid) return sendResponse(res, 400, null, "payload error")

    const password = generatePassword()
    const encrypedPassword = await encrypt(password)
    const query = getQuery(INSERT_USER)(name, email, roleId, encrypedPassword)
    try {
        const response = await queryDatabase(query)
        const data = { name, email, roleId, password, id: response.insertId }
        return sendResponse(res, 201, data)
    } catch (err) {
        if (err?.code.includes("ER_DUP_ENTRY")) return sendResponse(res, 409, null, err)
        return sendResponse(res, 500, null, err)
    }
}

module.exports = { addUser }