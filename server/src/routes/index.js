const authRouter = require("./auth")
const userRouter = require("./users")
const projectsRouter = require("./projects")
const ticketsRouter = require("./tickets")
const commentsRouter = require("./comments")

const setupRoutes = (app) => {
    app.use("/auth", authRouter)
    app.use("/users", userRouter)
    app.use("/projects", projectsRouter)
    app.use("/tickets", ticketsRouter)
    app.use("/comments", commentsRouter)
}


module.exports = { setupRoutes }