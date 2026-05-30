import { useEffect, useState } from "react"

import Navbar from "../Navbar"

import { toast } from "react-toastify"

import BASE_URL from "../../services/api"

import { Link } from "react-router-dom"

import "./index.css"

const AdminDashboard = () => {

    const [summary, setSummary] =
        useState(null)

    const [departments, setDepartments] =
        useState([])

    const [categories, setCategories] =
        useState([])

    const [monthlyTrends, setMonthlyTrends] =
        useState([])

    const [loading, setLoading] =
        useState(true)






    useEffect(() => {

        getDashboardData()

    }, [])






    const getDashboardData = async () => {

        try {

            setLoading(true)

            const token =
                localStorage.getItem("token")






            // SUMMARY
            const summaryResponse =
                await fetch(
                    `${BASE_URL}/admin/dashboard`,
                    {
                        headers: {
                            Authorization:
                            `Bearer ${token}`
                        }
                    }
                )

            const summaryData =
                await summaryResponse.json()

            if (summaryResponse.ok) {

                setSummary(summaryData)
            }






            // DEPARTMENT ANALYTICS
            const departmentResponse =
                await fetch(
                    `${BASE_URL}/admin/departments`,
                    {
                        headers: {
                            Authorization:
                            `Bearer ${token}`
                        }
                    }
                )

            const departmentData =
                await departmentResponse.json()

            if (departmentResponse.ok) {

                setDepartments(departmentData)
            }






            // CATEGORY ANALYTICS
            const categoryResponse =
                await fetch(
                    `${BASE_URL}/admin/categories`,
                    {
                        headers: {
                            Authorization:
                            `Bearer ${token}`
                        }
                    }
                )

            const categoryData =
                await categoryResponse.json()

            if (categoryResponse.ok) {

                setCategories(categoryData)
            }






            // MONTHLY TRENDS
            const trendsResponse =
                await fetch(
                    `${BASE_URL}/admin/monthly-trends`,
                    {
                        headers: {
                            Authorization:
                            `Bearer ${token}`
                        }
                    }
                )

            const trendsData =
                await trendsResponse.json()

            if (trendsResponse.ok) {

                setMonthlyTrends(trendsData)
            }

        } catch (error) {

            toast.error(
                "Failed to fetch dashboard"
            )

        } finally {

            setLoading(false)
        }
    }






    if (loading) {

        return (
            <div>
                <Navbar />
                <h1 className="loading-text">
                    Loading...
                </h1>
            </div>
        )
    }






    return (

        <div>

            <Navbar />

            <div className="admin-dashboard-container">

                <h1 className="dashboard-title">
                    Admin Dashboard
                </h1>






                {
                    summary && (

                        <div className="summary-grid">

                            <div className="summary-card">
                                <h2>
                                    Total Proposals
                                </h2>

                                <p>
                                    {
                                        summary.totalProposals
                                    }
                                </p>
                            </div>






                            <div className="summary-card">
                                <h2>
                                    Approved
                                </h2>

                                <p>
                                    {
                                        summary.approvedProposals
                                    }
                                </p>
                            </div>






                            <div className="summary-card">
                                <h2>
                                    Rejected
                                </h2>

                                <p>
                                    {
                                        summary.rejectedProposals
                                    }
                                </p>
                            </div>






                            <div className="summary-card">
                                <h2>
                                    Pending Reviews
                                </h2>

                                <p>
                                    {
                                        summary.pendingReviews
                                    }
                                </p>
                            </div>






                            <div className="summary-card">
                                <h2>
                                    Budget Utilization
                                </h2>

                                <p>
                                    ₹
                                    {
                                        summary.totalBudgetUtilization
                                    }
                                </p>
                            </div>

                        </div>
                    )
                }






                <div className="analytics-section">

                    <h2>
                        Department Analytics
                    </h2>






                    <table className="analytics-table">

                        <thead>

                            <tr>

                                <th>
                                    Department
                                </th>

                                <th>
                                    Total Events
                                </th>

                                <th>
                                    Total Budget
                                </th>

                            </tr>

                        </thead>






                        <tbody>

                            {
                                departments.map(each => (

                                    <tr key={each.department_name}>

                                        <td>
                                            {
                                                each.department_name
                                            }
                                        </td>

                                        <td>
                                            {
                                                each.total_events
                                            }
                                        </td>

                                        <td>
                                            ₹
                                            {
                                                each.total_budget || 0
                                            }
                                        </td>

                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>

                </div>






                <div className="analytics-section">

                    <h2>
                        Category Analytics
                    </h2>






                    <table className="analytics-table">

                        <thead>

                            <tr>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Total Events
                                </th>

                                <th>
                                    Total Budget
                                </th>

                            </tr>

                        </thead>






                        <tbody>

                            {
                                categories.map(each => (

                                    <tr key={each.category}>

                                        <td>
                                            {each.category}
                                        </td>

                                        <td>
                                            {
                                                each.total_events
                                            }
                                        </td>

                                        <td>
                                            ₹
                                            {
                                                each.total_budget || 0
                                            }
                                        </td>

                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>

                </div>






                <div className="analytics-section">

                    <h2>
                        Monthly Trends
                    </h2>






                    <table className="analytics-table">

                        <thead>

                            <tr>

                                <th>
                                    Month
                                </th>

                                <th>
                                    Total Proposals
                                </th>

                            </tr>

                        </thead>






                        <tbody>

                            {
                                monthlyTrends.map(each => (

                                    <tr key={each.month}>

                                        <td>
                                            {each.month}
                                        </td>

                                        <td>
                                            {
                                                each.total_proposals
                                            }
                                        </td>

                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>

                    

                </div>
                <div className="manage-btn-container">

    <Link
        to="/admin/proposals"
        className="manage-btn"
    >
        Manage Proposals
    </Link>

</div>

            </div>

        </div>
    )
}

export default AdminDashboard