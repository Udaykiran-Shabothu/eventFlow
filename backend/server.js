const express = require("express")

const cors = require("cors")

require("dotenv").config()





const {
    initializeDB
} = require("./database/db")

const authRoutes =
require("./routes/authRoutes")

const eventRoutes =
require("./routes/eventRoutes")

const adminRoutes =
require("./routes/adminRoutes")

const departmentRoutes =
require("./routes/departmentRoutes")





const app = express()






app.use(cors())

app.use(express.json())






// ROUTES
app.use(
    "/api/auth",
    authRoutes
)

app.use(
    "/api/events",
    eventRoutes
)

app.use(
    "/api/admin",
    adminRoutes
)

app.use(
    "/api/departments",
    departmentRoutes
)






// HOME ROUTE
app.get("/", (req, res) => {

    res.send(
        "Event Proposal API Running"
    )
})






// START SERVER
const startServer = async () => {

    try {

        await initializeDB()

        app.listen(
            process.env.PORT,
            () => {

                console.log(
                    `Server running on port ${process.env.PORT}`
                )
            }
        )

    } catch (error) {

        console.log(
            "Server Error:",
            error.message
        )
    }
}






startServer()