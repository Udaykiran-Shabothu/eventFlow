import { useEffect, useState } from "react"

import Navbar from "../Navbar"

import { toast } from "react-toastify"

import BASE_URL from "../../services/api"

import "./index.css"

const CreateProposal = () => {

    const [departments, setDepartments] =
        useState([])

    const [formData, setFormData] =
        useState({
            title: "",
            description: "",
            category: "",
            proposed_date: "",
            venue: "",
            estimated_budget: "",
            expected_audience: "",
            department_id: "",
            document_link: ""
        })

         useEffect(() => {

        getDepartments()

    }, [])

    const getDepartments = async () => {

        try {

            const response = await fetch(
                `${BASE_URL}/departments`
            )

            const data =
                await response.json()

            setDepartments(data)

        } catch (error) {

            toast.error(
                "Failed to fetch departments"
            )
        }
    }

     const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            const token =
                localStorage.getItem("token")

            const response = await fetch(
                `${BASE_URL}/events`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json",

                        Authorization:
                        `Bearer ${token}`
                    },
                     body: JSON.stringify(formData)
                }
            )

            const data =
                await response.json()

            if (!response.ok) {

                toast.error(data.error)

                return
            }

            toast.success(
                "Proposal created"
            )
             setFormData({
                title: "",
                description: "",
                category: "",
                proposed_date: "",
                venue: "",
                estimated_budget: "",
                expected_audience: "",
                department_id: "",
                document_link: ""
            })

        } catch {

            toast.error(
                "Failed to create proposal"
            )
        }
    }

    return (
        <div>

            <Navbar />

            <div className="proposal-form-container">

                <form
                    className="proposal-form"
                    onSubmit={handleSubmit}
                >

                    <h1>
                        Create Proposal
                    </h1>

                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleChange}
                    />

                    <input
                        type="date"
                        name="proposed_date"
                        value={formData.proposed_date}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="venue"
                        placeholder="Venue"
                        value={formData.venue}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="estimated_budget"
                        placeholder="Budget"
                        value={formData.estimated_budget}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="expected_audience"
                        placeholder="Audience Count"
                        value={formData.expected_audience}
                        onChange={handleChange}
                    />

                    <select
                        name="department_id"
                        value={formData.department_id}
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Department
                        </option>

                        {
                            departments.map(each => (

                                <option
                                    key={each.id}
                                    value={each.id}
                                >
                                    {each.name}
                                </option>
                            ))
                        }
                         </select>

                    <input
                        type="text"
                        name="document_link"
                        placeholder="Document Link"
                        value={formData.document_link}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Submit Proposal
                    </button>

                </form>

            </div>

        </div>
    )
}

export default CreateProposal