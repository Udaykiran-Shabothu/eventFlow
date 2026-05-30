const express = require("express")

const {
    registerUser,
    loginUser,
    getCoordinators
} = require("../controllers/authController")

const router = express.Router()

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/coordinators", getCoordinators)

module.exports = router