const express = require('express')
require("./db/mongoose.js")
const tasksRoutes=require("./routers/tasks")
const usersRoutes=require("./routers/users")
const app = express()


app.use(express.json())
app.use(tasksRoutes)
app.use(usersRoutes)

module.exports=app

