import { useEffect, useState } from "react"

import { Link, useNavigate } from "react-router-dom"

import { toast } from "react-toastify"

import BASE_URL from "../../services/api"

import "./index.css"

const Register = () => {

    const navigate = useNavigate()

    const [departments, setDepartments] =
        useState([])

    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            password: "",
            role: "organizer",
            department_id: ""
        })

    const [loading, setLoading] =
        useState(false)






    
    useEffect(() => {

        getDepartments()

    }, [])






    const getDepartments = async () => {

        try {

            const token =
                localStorage.getItem("token")

            const response = await fetch(
                `${BASE_URL}/departments`,
                {
                    headers: {
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            )

            const data =
                await response.json()

            setDepartments(data)

        } catch (error) {

            console.log(error)
        }
    }






    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
            e.target.value
        })
    }






    const handleSubmit = async (e) => {

        e.preventDefault()

        const {
            name,
            email,
            password,
            role,
            department_id
        } = formData

        if (
            !name ||
            !email ||
            !password ||
            !department_id
        ) {

            toast.error(
                "All fields are required"
            )

            return
        }

        try {

            setLoading(true)

            const response = await fetch(
                `${BASE_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        role,
                        department_id
                    })
                }
            )

            const data =
                await response.json()

            if (!response.ok) {

                toast.error(data.error)

                setLoading(false)

                return
            }

            toast.success(
                "Registration successful"
            )

            navigate("/")

        } catch (error) {

            toast.error(
                "Something went wrong"
            )

        } finally {

            setLoading(false)
        }
    }






    return (

        <div className="register-container">

            <form
                className="register-form"
                onSubmit={handleSubmit}
            >

                <h1>Register</h1>





                <div className="input-group">

                    <label>Name</label>

                    <input
                        type="text"
                        name="name"

                        value={formData.name}

                        onChange={handleChange}

                        placeholder="Enter name"
                    />

                </div>






                <div className="input-group">

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"

                        value={formData.email}

                        onChange={handleChange}

                        placeholder="Enter email"
                    />

                </div>






                <div className="input-group">

                    <label>Password</label>

                    <input
                        type="password"
                        name="password"

                        value={formData.password}

                        onChange={handleChange}

                        placeholder="Enter password"
                    />

                </div>






                <div className="input-group">

                    <label>Department</label>

                    <select
                        name="department_id"

                        value={
                            formData.department_id
                        }

                        onChange={handleChange}
                    >

                        <option value="">
                            Select Department
                        </option>

                        {
                            departments.map(
                                each => (
                                    <option
                                        key={each.id}
                                        value={each.id}
                                    >
                                        {each.name}
                                    </option>
                                )
                            )
                        }

                    </select>

                </div>






                <button
                    type="submit"
                    className="register-btn"
                >

                    {
                        loading
                        ? "Loading..."
                        : "Register"
                    }

                </button>






                <p className="auth-link">

                    Already have account?

                    <Link to="/">
                        Login
                    </Link>

                </p>

            </form>

        </div>
    )
}

export default Register