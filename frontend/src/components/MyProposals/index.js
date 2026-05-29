import { useEffect, useState } from "react"

import { Link } from "react-router-dom"

import { toast } from "react-toastify"

import Navbar from "../Navbar"

import BASE_URL from "../../services/api"

import "./index.css"

const MyProposals = () => {

    const [proposals, setProposals] =
        useState([])

    const [loading, setLoading] =
        useState(true)






    useEffect(() => {

        getMyProposals()

    }, [])






    const getMyProposals = async () => {

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

                setProposals(data.data)
            }

        } catch (error) {

            console.log(error)

        } finally {

            setLoading(false)
        }
    }






    const deleteProposal =
    async (id) => {

        const confirmDelete =
            window.confirm(
                "Delete this proposal?"
            )

        if (!confirmDelete) {
            return
        }

        try {

            const token =
                localStorage.getItem("token")

            const response = await fetch(
                `${BASE_URL}/events/${id}`,
                {
                    method: "DELETE",

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

            toast.success(data.message)

            getMyProposals()

        } catch (error) {

            toast.error(
                "Delete failed"
            )
        }
    }






    const renderStatus = (status) => {

        if (status === "Approved") {

            return (
                <span className="approved">
                    Approved
                </span>
            )
        }

        if (status === "Rejected") {

            return (
                <span className="rejected">
                    Rejected
                </span>
            )
        }

        if (status === "In Review") {

            return (
                <span className="review">
                    In Review
                </span>
            )
        }

        if (
            status ===
            "Changes Required"
        ) {

            return (
                <span className="changes">
                    Changes Required
                </span>
            )
        }

        return (
            <span className="pending">
                Pending
            </span>
        )
    }






    return (

        <div className="my-proposals-bg">

            <Navbar />






            <div className="my-proposals-container">

                <h1 className="page-heading">
                    My Proposals
                </h1>






                {
                    loading
                    ? (
                        <p>
                            Loading...
                        </p>
                    )
                    : proposals.length === 0
                    ? (
                        <div className="empty-view">

                            <h2>
                                No proposals found
                            </h2>

                            <Link
                                to="/create-proposal"
                                className="create-link"
                            >
                                Create Proposal
                            </Link>

                        </div>
                    )
                    : (

                        <div className="proposal-list">

                            {
                                proposals.map(
                                    each => (

                                        <div
                                            key={each.id}
                                            className="proposal-card"
                                        >

                                            <div>

                                                <h2>
                                                    {each.title}
                                                </h2>

                                                <p>
                                                    {each.category}
                                                </p>

                                                <p>
                                                    Venue:
                                                    {" "}
                                                    {each.venue}
                                                </p>

                                                <p>
                                                    Budget:
                                                    {" "}
                                                    ₹
                                                    {each.estimated_budget}
                                                </p>

                                            </div>






                                            <div className="proposal-right">

                                                {
                                                    renderStatus(
                                                        each.status
                                                    )
                                                }






                                                <div className="proposal-actions">

                                                    <Link
                                                        to={`/proposal/${each.id}`}
                                                        className="view-btn"
                                                    >
                                                        View
                                                    </Link>






                                                    {
                                                        each.status ===
                                                        "Pending" && (

                                                            <button
                                                                className="delete-btn"
                                                                onClick={() =>
                                                                    deleteProposal(each.id)
                                                                }
                                                            >
                                                                Delete
                                                            </button>
                                                        )
                                                    }

                                                </div>

                                            </div>

                                        </div>
                                    )
                                )
                            }

                        </div>
                    )
                }

            </div>

        </div>
    )
}

export default MyProposals