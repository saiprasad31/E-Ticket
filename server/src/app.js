require("dotenv").config();
const express = require("express")
const { setupRoutes } = require("./routes")

const app = express()

app.use(express.json())

setupRoutes(app)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))