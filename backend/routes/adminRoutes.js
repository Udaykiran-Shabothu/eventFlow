const express = require("express")

const {
    getDashboardSummary,
    getDepartmentAnalytics,
    getCategoryAnalytics,
    getMonthlyTrends
} = require("../controllers/adminController")

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const router = express.Router()

// Dashboard Summary
router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("admin"),
    getDashboardSummary
)

// Department Analytics
router.get(
    "/departments",
    authMiddleware,
    roleMiddleware("admin"),
    getDepartmentAnalytics
)

// Category Analytics
router.get(
    "/categories",
    authMiddleware,
    roleMiddleware("admin"),
    getCategoryAnalytics
)

// Monthly Trends
router.get(
    "/monthly-trends",
    authMiddleware,
    roleMiddleware("admin"),
    getMonthlyTrends
)

module.exports = router