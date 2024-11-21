const express = require('express')
require("./db/mongoose.js")
const tasksRoutes=require("./routers/tasks")
const usersRoutes=require("./routers/users")
const app = express()


app.use(express.json())
app.use(tasksRoutes)
app.use(usersRoutes)

const port = process.env.PORT


app.listen(port, () => {
    console.log("Server is running on", port)
})