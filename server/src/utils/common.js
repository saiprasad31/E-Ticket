const generator = require('generate-password');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require("../config/db")

const sendResponse = (res, code, data, err) => {
    if (err) return res.status(code).send({ err })

    res.status(code).send({ data })
}

const generatePassword = () => {
    return generator.generate({
        length: 10,
        numbers: true
    });
}

const encrypt = (text) => {
    return bcrypt.hash(text, parseInt(process.env.SALT))
}

const validateEncryptedText = (text, hashedText) => {
    return bcrypt.compare(text, hashedText)
}

const queryDatabase = (query) => {
    return new Promise((resolve, reject) => {
        db.query(query, (err, results, fields) => {
            if (err) reject(err)
            resolve(results)
        })
    })
}

const createToken = (data, secret, expiresIn, jwtid) => {
    return jwt.sign(
        { ...data },
        secret,
        { expiresIn, jwtid }
    )
}

const verifyToken = (token, secret) => {
    return jwt.verify(token, secret)
}

const decodeToken = (token) => {
    return jwt.decode(token)
}

const getCurrentTimeStamp = () => {
    return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

const removeUnwantedDataFromUser = (user) => {
    const data = { ...user }
    delete data.password;
    delete data.refreshToken;
    delete data.createdAt;
    return data
}

module.exports = {
    sendResponse,
    generatePassword,
    encrypt,
    validateEncryptedText,
    queryDatabase,
    createToken,
    verifyToken,
    decodeToken,
    getCurrentTimeStamp,
    removeUnwantedDataFromUser,
}