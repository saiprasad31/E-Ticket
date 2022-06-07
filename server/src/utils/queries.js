const {
    INSERT_USER,
    GET_ALL_USERS,
    GET_USER_BY_EMAIL,
    GET_USER_BY_ID,
    SAVE_TOKEN,
    DELETE_TOKEN,
    DELETE_USER,
    UPDATE_USER,
    UPDATE_ACTIVE_STATUS,
    UPDATE_PASSWORD,
    CREATE_PROJECT,
    GET_ALL_PROJECTS,
    GET_ALL_PROJECTS_BY_ID,
    DELETE_PROJECT,
    DELETE_PROJECT_BY_ADMIN,
    UPDATE_PROJECT,
    UPDATE_PROJECT_BY_ADMIN,
    CREATE_TICKET,
    GET_PROJECT,
    DELETE_TICKET,
    DELETE_TICKET_BY_ADMIN,
    GET_TICKETS_PROJECT_ID,
    GET_TICKET,
    UPDATE_TICKET,
    CREATE_COMMENT,
    DELETE_COMMENT_BY_ADMIN,
    DELETE_COMMENT,
    GET_COMMENTS,
    UPDATE_COMMENT,
} = require("./constants")

const getQuery = (name) => {
    let query
    switch (name) {
        case INSERT_USER:
            query = `INSERT INTO users (name, email, roleId, password) VALUES ("{0}","{1}",{2},"{3}")`
            break;
        case GET_ALL_USERS:
            query = `SELECT id, name, email, roleId FROM users WHERE roleId!=1`
            break;
        case GET_USER_BY_EMAIL:
            query = `SELECT * FROM users WHERE email="{0}"`
            break;
        case GET_USER_BY_ID:
            query = `SELECT u.*, r.permissions FROM users u JOIN roles r on u.roleId = r.id WHERE u.id="{0}"`
            break;
        case SAVE_TOKEN:
            query = `UPDATE users SET refreshToken="{0}" WHERE id="{1}"`
            break;
        case DELETE_TOKEN:
            query = `UPDATE users SET refreshToken=NULL WHERE id="{0}"`
            break;
        case DELETE_USER:
            query = `DELETE FROM users WHERE id="{0}"`
            break;
        case UPDATE_USER:
            query = `UPDATE users SET roleId="{0}", active="{1}" WHERE id="{2}"`
            break;
        case UPDATE_ACTIVE_STATUS:
            query = `UPDATE users SET active="{0}" WHERE id="{1}"`
            break;
        case UPDATE_PASSWORD:
            query = `UPDATE users SET password="{0}", refreshToken=NULL, firstLogin=0 WHERE id="{1}"`
            break;
        case CREATE_PROJECT:
            query = `INSERT INTO projects (project_name, description, createdBy, slug) VALUES ("{0}","{1}","{2}","{3}")`
            break;
        case GET_ALL_PROJECTS:
            query = `SELECT * FROM projects`
            break;
        case GET_ALL_PROJECTS_BY_ID:
            query = `SELECT * FROM projects where createdBy={0}`
            break;
        case GET_PROJECT:
            query = `SELECT p.*, count(t.id) as count FROM projects p LEFT JOIN tickets t on p.id=t.projectId where p.id={0}`
            break;
        case DELETE_PROJECT:
            query = `DELETE FROM projects where id={0} AND createdBy={1}`
            break;
        case DELETE_PROJECT_BY_ADMIN:
            query = `DELETE FROM projects where id={0}`
            break;
        case UPDATE_PROJECT:
            query = `UPDATE projects SET project_name="{0}", description="{1}", slug="{2}" WHERE id={3} AND createdBy={4}`
            break;
        case UPDATE_PROJECT_BY_ADMIN:
            query = `UPDATE projects SET project_name="{0}", description="{1}", slug="{2}" WHERE id={3}`
            break;
        case CREATE_TICKET:
            query = `INSERT INTO tickets
             (ticket_number, title, description, createdBy, projectId, lastUpdatedBy, lastUpdatedAt, history, assignedTo)
             VALUES ("{0}","{1}","{2}","{3}","{4}","{5}","{6}",'{7}',"{8}")`
            break;
        case DELETE_TICKET:
            query = `DELETE FROM tickets WHERE id={0} AND createdBy={1}`
            break;
        case DELETE_TICKET_BY_ADMIN:
            query = `DELETE FROM tickets WHERE id={0}`
            break;
        case GET_TICKETS_PROJECT_ID:
            query = `SELECT * FROM tickets WHERE projectId={0}`
            break;
        case GET_TICKET:
            query = `SELECT * FROM tickets WHERE id={0}`
            break;
        case UPDATE_TICKET:
            query = `UPDATE tickets
             set title="{0}", description="{1}", lastUpdatedBy={2}, lastUpdatedAt="{3}", history='{4}', assignedTo={5}, status={6} 
             WHERE id={7}`
            break;
        case CREATE_COMMENT:
            query = `INSERT INTO comments (comment, createdBy, ticketId) VALUES ("{0}","{1}","{2}")`
            break;
        case DELETE_COMMENT:
            query = `DELETE FROM comments WHERE id={0} AND createdBy={1}`
            break;
        case DELETE_COMMENT_BY_ADMIN:
            query = `DELETE FROM comments WHERE id={0}`
            break;
        case GET_COMMENTS:
            query = `SELECT c.*,u.name AS userName FROM comments c JOIN users u ON c.createdBy=u.id WHERE ticketId={0}`
            break;
        case UPDATE_COMMENT:
            query = `UPDATE comments SET comment="{0}", updatedAt="{1}" WHERE id={2} AND createdBy={3}`
            break;
        default:
            throw new Error("No query name passed")
    }
    return (...args) => {
        if (!args.length) return query
        let generatedQuery = query
        args.forEach((arg, i) => {
            generatedQuery = generatedQuery.replace(`{${i}}`, arg)
        })
        return generatedQuery
    }
}

module.exports = {
    getQuery
}
