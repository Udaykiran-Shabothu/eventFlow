const express = require("express")

const {
    getAllDepartments,
    createDepartment
} = require("../controllers/departmentController")

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const router = express.Router()

// GET ALL DEPARTMENTS
router.get(
    "/",
    getAllDepartments
)

// CREATE DEPARTMENT
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createDepartment
)

module.exports = router