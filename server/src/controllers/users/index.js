const { getAllUsers, getUser } = require("./getUsers")
const { addUser } = require("./addUser")
const { deleteUser } = require("./deleteUser")
const { updateUser } = require("./updateUser")
const { updatePassword } = require("./updatePassword")

module.exports = {
    getAllUsers,
    addUser,
    getUser,
    deleteUser,
    updateUser,
    updatePassword,
}