const { isEmail, isEmpty, isNumeric, isStrongPassword, matches } = require("validator")
const { isNumber, isString } = require("lodash")

const isAddUserPayloadValid = (name, email, roleId) => {
    const isNameValid = name && isString(name) && name.length >= 3
    const isEmailValid = email && isEmail(email)
    const isRoleIdValid = roleId && isNumber(roleId)

    return isNameValid && isEmailValid && isRoleIdValid
}

const isUpdateUserPayloadValid = (roleId, status) => {
    const isRoleIdValid = isNumber(roleId)
    const isStatusValid = isNumber(status) && (status === 0 || status === 1)

    return isStatusValid && isRoleIdValid
}

const isLoginPayloadValid = (email, password) => {
    const isEmailValid = email && isEmail(email)
    const isPasswordValid = password && isString(password) && password.length >= parseInt(process.env.PASSWORD_MIN_LENGTH)

    return isEmailValid && isPasswordValid
}

const isUpdatePasswordPayloadValid = (oldPassword, newPassword) => {
    return isString(oldPassword) && isString(newPassword) && oldPassword.length >= 8 && newPassword.length >= 8
}

const isCreateProjectPayloadvalid = (name, desc) => {
    return isString(name) && isString(desc) && !isEmpty(name) && !isEmpty(desc)
}

const isCreateTicketPayloadValid = (title, description, projectId, assignedTo) => {
    const isTitlevalid = isString(title) && title.length > 3
    const isDescriptionValid = isString(description) && description.length > 3 && description.length <= 1000
    const isProjectIdValid = isNumber(projectId)
    const isAssignedToValid = isNumber(assignedTo)

    return isTitlevalid && isDescriptionValid && isProjectIdValid && isAssignedToValid
}

const isUpdateTicketPayloadValid = (title, description, assignedTo, status) => {
    const isTitlevalid = isString(title) && title.length > 3
    const isDescriptionValid = isString(description) && description.length > 3 && description.length <= 1000
    const isStatusIdValid = isNumber(status)
    const isAssignedToValid = isNumber(assignedTo)

    return isTitlevalid && isDescriptionValid && isStatusIdValid && isAssignedToValid
}

const isCreateCommentPayloadvalid = (comment, ticketId) => {
    const isCommentValid = isString(comment) && !isEmpty(comment)
    const isTicketIdValid = isNumber(ticketId)

    return isCommentValid && isTicketIdValid
}

const isUpdateCommentPayloadvalid = (comment) => {
    const isCommentValid = isString(comment) && !isEmpty(comment)

    return isCommentValid
}

module.exports = {
    isAddUserPayloadValid,
    isUpdateUserPayloadValid,
    isLoginPayloadValid,
    isCreateProjectPayloadvalid,
    isUpdatePasswordPayloadValid,
    isCreateTicketPayloadValid,
    isUpdateTicketPayloadValid,
    isCreateCommentPayloadvalid,
    isUpdateCommentPayloadvalid,
}