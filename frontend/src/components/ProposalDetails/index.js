import { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import { toast } from "react-toastify"

import Navbar from "../Navbar"

import BASE_URL from "../../services/api"

import "./index.css"

const ProposalDetails = () => {

    const { id } = useParams()

    const [proposal, setProposal] =
        useState(null)

    const [comments, setComments] =
        useState([])

    const [history, setHistory] =
        useState([])

    const [loading, setLoading] =
        useState(true)






    useEffect(() => {

        const getProposalDetails = async () => {

            try {

                setLoading(true)

                const token =
                    localStorage.getItem("token")






                // PROPOSAL DETAILS
                const proposalResponse =
                    await fetch(
                        `${BASE_URL}/events/${id}`,
                        {
                            headers: {
                                Authorization:
                                `Bearer ${token}`
                            }
                        }
                    )

                const proposalData =
                    await proposalResponse.json()

                if (!proposalResponse.ok) {

                    toast.error(
                        proposalData.error
                    )

                    setLoading(false)

                    return
                }

                setProposal(proposalData)






                // COMMENTS
                const commentsResponse =
                    await fetch(
                        `${BASE_URL}/events/${id}/comments`,
                        {
                            headers: {
                                Authorization:
                                `Bearer ${token}`
                            }
                        }
                    )

                const commentsData =
                    await commentsResponse.json()

                if (commentsResponse.ok) {

                    setComments(commentsData)
                }






                // HISTORY
                const historyResponse =
                    await fetch(
                        `${BASE_URL}/events/${id}/history`,
                        {
                            headers: {
                                Authorization:
                                `Bearer ${token}`
                            }
                        }
                    )

                const historyData =
                    await historyResponse.json()

                if (historyResponse.ok) {

                    setHistory(historyData)
                }

            } catch (error) {

                toast.error(
                    "Failed to fetch proposal details"
                )

            } finally {

                setLoading(false)
            }
        }

        getProposalDetails()

    }, [id])






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






    if (!proposal) {

        return (
            <div>
                <Navbar />
                <h1 className="error-text">
                    Proposal Not Found
                </h1>
            </div>
        )
    }






    return (

        <div>

            <Navbar />

            <div className="proposal-details-container">

                <h1 className="details-heading">
                    Proposal Details
                </h1>






                <div className="proposal-card">

                    <h2>
                        {proposal.title}
                    </h2>

                    <p>
                        <strong>
                            Description:
                        </strong>

                        {proposal.description}
                    </p>

                    <p>
                        <strong>
                            Category:
                        </strong>

                        {proposal.category}
                    </p>

                    <p>
                        <strong>
                            Proposed Date:
                        </strong>

                        {proposal.proposed_date}
                    </p>

                    <p>
                        <strong>
                            Venue:
                        </strong>

                        {proposal.venue}
                    </p>

                    <p>
                        <strong>
                            Budget:
                        </strong>

                        ₹{proposal.estimated_budget}
                    </p>

                    <p>
                        <strong>
                            Expected Audience:
                        </strong>

                        {proposal.expected_audience}
                    </p>

                    <p>
                        <strong>
                            Status:
                        </strong>

                        {proposal.status}
                    </p>

                    <p>
                        <strong>
                            Priority:
                        </strong>

                        {
                            proposal.priority ||
                            "Not Assigned"
                        }
                    </p>






                    {
                        proposal.document_link && (

                            <p>

                                <strong>
                                    Document:
                                </strong>

                                <a
                                    href={
                                        proposal.document_link
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View Document
                                </a>

                            </p>
                        )
                    }

                </div>






                <div className="timeline-section">

                    <h2>
                        Review Comments
                    </h2>






                    {
                        comments.length === 0 ? (

                            <p>
                                No comments available
                            </p>

                        ) : (

                            comments.map(each => (

                                <div
                                    key={each.id}
                                    className="comment-card"
                                >

                                    <p>
                                        <strong>
                                            {
                                                each.reviewer_name
                                            }
                                        </strong>

                                        (
                                        {
                                            each.reviewer_role
                                        }
                                        )
                                    </p>

                                    <p>
                                        {each.comment}
                                    </p>

                                    <small>
                                        {
                                            each.created_at
                                        }
                                    </small>

                                </div>
                            ))
                        )
                    }

                </div>






                <div className="timeline-section">

                    <h2>
                        Proposal History
                    </h2>






                    {
                        history.length === 0 ? (

                            <p>
                                No history available
                            </p>

                        ) : (

                            history.map(each => (

                                <div
                                    key={each.id}
                                    className="history-card"
                                >

                                    <p>
                                        <strong>
                                            {
                                                each.action
                                            }
                                        </strong>
                                    </p>

                                    <p>
                                        By:
                                        {
                                            each.performed_by_name
                                        }
                                    </p>

                                    <small>
                                        {
                                            each.created_at
                                        }
                                    </small>

                                </div>
                            ))
                        )
                    }

                </div>

            </div>

        </div>
    )
}

export default ProposalDetails