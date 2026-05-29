import { useEffect, useState } from "react"

import { Link } from "react-router-dom"

import { toast } from "react-toastify"

import Navbar from "../Navbar"

import BASE_URL from "../../services/api"

import "./index.css"

const CoordinatorDashboard = () => {

    const [proposals, setProposals] =
        useState([])

    const [loading, setLoading] =
        useState(true)






    useEffect(() => {

        getProposals()

    }, [])






    const getProposals = async () => {

        try {

            setLoading(true)

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

            if (!response.ok) {

                toast.error(data.error)

                return
            }

            setProposals(data.data)

        } catch (error) {

            toast.error(
                "Failed to fetch proposals"
            )

        } finally {

            setLoading(false)
        }
    }






    const updateStatus = async (
        proposalId,
        status
    ) => {

        try {

            const token =
                localStorage.getItem("token")

            const response = await fetch(
                `${BASE_URL}/events/${proposalId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                        "application/json",

                        Authorization:
                        `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status
                    })
                }
            )

            const data =
                await response.json()

            if (!response.ok) {

                toast.error(data.error)

                return
            }

            toast.success(
                "Status updated"
            )

            getProposals()

        } catch (error) {

            toast.error(
                "Update failed"
            )
        }
    }






    const updatePriority = async (
        proposalId,
        priority
    ) => {

        try {

            const token =
                localStorage.getItem("token")

            const response = await fetch(
                `${BASE_URL}/events/${proposalId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                        "application/json",

                        Authorization:
                        `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        priority
                    })
                }
            )

            const data =
                await response.json()

            if (!response.ok) {

                toast.error(data.error)

                return
            }

            toast.success(
                "Priority updated"
            )

            getProposals()

        } catch (error) {

            toast.error(
                "Priority update failed"
            )
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

            <div className="coordinator-container">

                <h1 className="dashboard-heading">
                    Coordinator Review Queue
                </h1>






                {
                    proposals.length === 0 ? (

                        <p>
                            No proposals assigned
                        </p>

                    ) : (

                        <div className="proposal-list">

                            {
                                proposals.map(each => (

                                    <div
                                        key={each.id}
                                        className="proposal-card"
                                    >

                                        <h2>
                                            {each.title}
                                        </h2>

                                        <p>
                                            <strong>
                                                Category:
                                            </strong>

                                            {each.category}
                                        </p>

                                        <p>
                                            <strong>
                                                Status:
                                            </strong>

                                            {each.status}
                                        </p>

                                        <p>
                                            <strong>
                                                Budget:
                                            </strong>

                                            ₹
                                            {
                                                each.estimated_budget
                                            }
                                        </p>






                                        <div className="action-group">

                                            <select
                                                defaultValue={
                                                    each.status
                                                }

                                                onChange={(e) =>
                                                    updateStatus(
                                                        each.id,
                                                        e.target.value
                                                    )
                                                }
                                            >

                                                <option>
                                                    Pending
                                                </option>

                                                <option>
                                                    In Review
                                                </option>

                                                <option>
                                                    Changes Required
                                                </option>

                                                <option>
                                                    Approved
                                                </option>

                                                <option>
                                                    Rejected
                                                </option>

                                            </select>






                                            <select
                                                defaultValue={
                                                    each.priority ||
                                                    ""
                                                }

                                                onChange={(e) =>
                                                    updatePriority(
                                                        each.id,
                                                        e.target.value
                                                    )
                                                }
                                            >

                                                <option value="">
                                                    Select Priority
                                                </option>

                                                <option>
                                                    Low
                                                </option>

                                                <option>
                                                    Medium
                                                </option>

                                                <option>
                                                    High
                                                </option>

                                            </select>






                                            <Link
                                                to={`/proposal/${each.id}`}
                                                className="details-btn"
                                            >
                                                View Details
                                            </Link>

                                        </div>

                                    </div>
                                ))
                            }

                        </div>
                    )
                }

            </div>

        </div>
    )
}

export default CoordinatorDashboard