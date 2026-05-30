import { useEffect, useState } from "react"

import { toast } from "react-toastify"

import Navbar from "../Navbar"

import BASE_URL from "../../services/api"

import "./index.css"

const AdminManageProposals = () => {

    const [proposals, setProposals] =
        useState([])

    const [coordinators, setCoordinators] =
        useState([])

    const [loading, setLoading] =
        useState(true)





    useEffect(() => {

        getProposals()

        getCoordinators()

    }, [])





    const getProposals = async () => {

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

            if (!response.ok) {

                toast.error(data.error)

                return
            }

            setProposals(data.data)

        } catch {

            toast.error(
                "Failed to fetch proposals"
            )

        } finally {

            setLoading(false)
        }
    }





    const getCoordinators = async () => {

        try {

            const token =
                localStorage.getItem("token")

            const response = await fetch(
                `${BASE_URL}/auth/coordinators`,
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

            setCoordinators(data)

        } catch {

            toast.error(
                "Failed to fetch coordinators"
            )
        }
    }





    const assignCoordinator = async (
        proposalId,
        coordinatorId
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
                        coordinator_id:
                            coordinatorId
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
                "Coordinator Assigned"
            )

            getProposals()

        } catch {

            toast.error(
                "Assignment failed"
            )
        }
    }





    if (loading) {

        return (
            <>
                <Navbar />
                <h1>
                    Loading...
                </h1>
            </>
        )
    }





    return (

        <div>

            <Navbar />

            <div className="admin-proposals-container">

                <h1>
                    Proposal Assignment
                </h1>





                {
                    proposals.length === 0 ? (

                        <p>
                            No proposals found
                        </p>

                    ) : (

                        <div className="proposal-grid">

                            {
                                proposals.map(
                                    proposal => {

                                        return (

                                            <div
                                                key={proposal.id}
                                                className="proposal-card"
                                            >

                                                <h2>
                                                    {
                                                        proposal.title
                                                    }
                                                </h2>

                                                <p>
                                                    <strong>
                                                        Category:
                                                    </strong>
                                                    {" "}
                                                    {
                                                        proposal.category
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Status:
                                                    </strong>
                                                    {" "}
                                                    {
                                                        proposal.status
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Budget:
                                                    </strong>
                                                    {" "}
                                                    ₹
                                                    {
                                                        proposal.estimated_budget
                                                    }
                                                </p>





                                                <select
                                                    defaultValue={
                                                        proposal.coordinator_id ||
                                                        ""
                                                    }

                                                    onChange={(e) =>
                                                        assignCoordinator(
                                                            proposal.id,
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="">
                                                        Select Coordinator
                                                    </option>

                                                    {
                                                        coordinators.map(
                                                            coordinator => (
                                                                <option
                                                                    key={
                                                                        coordinator.id
                                                                    }

                                                                    value={
                                                                        coordinator.id
                                                                    }
                                                                >
                                                                    {
                                                                        coordinator.name
                                                                    }
                                                                </option>
                                                            )
                                                        )
                                                    }

                                                </select>

                                            </div>
                                        )
                                    }
                                )
                            }

                        </div>
                    )
                }

            </div>

        </div>
    )
}

export default AdminManageProposals