import { useEffect, useState } from "react"

import { Link } from "react-router-dom"

import Navbar from "../Navbar"

import BASE_URL from "../../services/api"

import "./index.css"

const OrganizerDashboard = () => {

    const [stats, setStats] =
        useState({
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0
        })

    const [loading, setLoading] =
        useState(true)






    useEffect(() => {

        getDashboardData()

    }, [])






    const getDashboardData = async () => {

        try {

            const token =
                localStorage.getItem("token")

            const response = await fetch(
                `${BASE_URL}/events`,
                {
                    headers: {
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            )

            const data =
                await response.json()

            if (response.ok) {

                const proposals =
                    data.data || []

                setStats({

                    total:
                    proposals.length,

                    pending:
                    proposals.filter(
                        each =>
                            each.status ===
                            "Pending"
                    ).length,

                    approved:
                    proposals.filter(
                        each =>
                            each.status ===
                            "Approved"
                    ).length,

                    rejected:
                    proposals.filter(
                        each =>
                            each.status ===
                            "Rejected"
                    ).length
                })
            }

        } catch (error) {

            console.log(error)

        } finally {

            setLoading(false)
        }
    }






    return (

        <div className="dashboard-bg">

            <Navbar />






            <div className="dashboard-container">

                <h1 className="dashboard-heading">
                    Organizer Dashboard
                </h1>






                {
                    loading
                    ? (
                        <p>
                            Loading...
                        </p>
                    )
                    : (

                        <div className="stats-container">

                            <div className="stat-card">
                                <h2>
                                    Total Proposals
                                </h2>

                                <p>
                                    {stats.total}
                                </p>
                            </div>






                            <div className="stat-card">
                                <h2>
                                    Pending
                                </h2>

                                <p>
                                    {stats.pending}
                                </p>
                            </div>






                            <div className="stat-card">
                                <h2>
                                    Approved
                                </h2>

                                <p>
                                    {stats.approved}
                                </p>
                            </div>






                            <div className="stat-card">
                                <h2>
                                    Rejected
                                </h2>

                                <p>
                                    {stats.rejected}
                                </p>
                            </div>

                        </div>
                    )
                }






                <div className="action-buttons">

                    <Link
                        to="/create-proposal"
                        className="action-btn"
                    >
                        Create Proposal
                    </Link>






                    <Link
                        to="/my-proposals"
                        className="action-btn"
                    >
                        My Proposals
                    </Link>

                </div>

            </div>

        </div>
    )
}

export default OrganizerDashboard