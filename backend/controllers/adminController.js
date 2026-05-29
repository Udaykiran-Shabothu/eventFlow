const {
    getDB
} = require("../database/db")




// DASHBOARD SUMMARY
const getDashboardSummary = async (req, res) => {

    try {

        const db = getDB()

        // Total proposals
        const totalProposals = await db.get(
            `
            SELECT COUNT(*) AS count
            FROM event_proposals
            `
        )

        // Approved
        const approvedProposals = await db.get(
            `
            SELECT COUNT(*) AS count
            FROM event_proposals
            WHERE status = 'Approved'
            `
        )

        // Rejected
        const rejectedProposals = await db.get(
            `
            SELECT COUNT(*) AS count
            FROM event_proposals
            WHERE status = 'Rejected'
            `
        )

        // Pending
        const pendingReviews = await db.get(
            `
            SELECT COUNT(*) AS count
            FROM event_proposals
            WHERE status IN
            (
                'Pending',
                'In Review',
                'Changes Required'
            )
            `
        )

        // Budget Utilization
        const budgetUtilization = await db.get(
            `
            SELECT
                SUM(estimated_budget)
                AS total_budget
            FROM event_proposals
            WHERE status = 'Approved'
            `
        )

        res.status(200).json({

            totalProposals:
                totalProposals.count,

            approvedProposals:
                approvedProposals.count,

            rejectedProposals:
                rejectedProposals.count,

            pendingReviews:
                pendingReviews.count,

            totalBudgetUtilization:
                budgetUtilization.total_budget || 0
        })

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}









// DEPARTMENT ANALYTICS
const getDepartmentAnalytics = async (req, res) => {

    try {

        const db = getDB()

        const analytics = await db.all(
            `
            SELECT
                departments.name AS department_name,

                COUNT(event_proposals.id)
                AS total_events,

                SUM(event_proposals.estimated_budget)
                AS total_budget

            FROM departments

            LEFT JOIN event_proposals
            ON departments.id =
            event_proposals.department_id

            GROUP BY departments.id

            ORDER BY total_events DESC
            `
        )

        res.status(200).json(analytics)

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}









// CATEGORY ANALYTICS
const getCategoryAnalytics = async (req, res) => {

    try {

        const db = getDB()

        const analytics = await db.all(
            `
            SELECT
                category,

                COUNT(*) AS total_events,

                SUM(estimated_budget)
                AS total_budget

            FROM event_proposals

            GROUP BY category

            ORDER BY total_events DESC
            `
        )

        res.status(200).json(analytics)

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}









// MONTHLY TRENDS
const getMonthlyTrends = async (req, res) => {

    try {

        const db = getDB()

        const trends = await db.all(
            `
            SELECT

                strftime(
                    '%Y-%m',
                    created_at
                ) AS month,

                COUNT(*) AS total_proposals

            FROM event_proposals

            GROUP BY month

            ORDER BY month ASC
            `
        )

        res.status(200).json(trends)

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}

module.exports = {
    getDashboardSummary,
    getDepartmentAnalytics,
    getCategoryAnalytics,
    getMonthlyTrends
}