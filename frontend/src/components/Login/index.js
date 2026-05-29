import { useState, useContext } from "react"

import { Link, useNavigate } from "react-router-dom"

import { toast } from "react-toastify"

import { AuthContext } from "../../context/AuthContext"

import BASE_URL from "../../services/api"

import "./index.css"

const Login = () => {

    const navigate = useNavigate()

    const { login } =
        useContext(AuthContext)

    const [email, setEmail] =
        useState("")

    const [password, setPassword] =
        useState("")

    const [loading, setLoading] =
        useState(false)





    const handleLogin = async (e) => {

        e.preventDefault()

        if (!email || !password) {

            toast.error(
                "All fields are required"
            )

            return
        }

        try {

            setLoading(true)

            const response = await fetch(
                `${BASE_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            )

            const data =
                await response.json()

            if (!response.ok) {

                toast.error(
                    data.error
                )

                setLoading(false)

                return
            }

            login(
                data.token,
                data.user
            )

            toast.success(
                "Login successful"
            )

            // ROLE REDIRECT
            if (
                data.user.role ===
                "organizer"
            ) {

                navigate("/organizer")
            }

            else if (
                data.user.role ===
                "coordinator"
            ) {

                navigate("/coordinator")
            }

            else if (
                data.user.role ===
                "admin"
            ) {

                navigate("/admin")
            }

        } catch (error) {

            toast.error(
                "Something went wrong"
            )

        } finally {

            setLoading(false)
        }
    }






    return (

        <div className="login-container">

            <form
                className="login-form"
                onSubmit={handleLogin}
            >

                <h1>Login</h1>





                <div className="input-group">

                    <label>Email</label>

                    <input
                        type="email"

                        value={email}

                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }

                        placeholder="Enter email"
                    />

                </div>






                <div className="input-group">

                    <label>Password</label>

                    <input
                        type="password"

                        value={password}

                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }

                        placeholder="Enter password"
                    />

                </div>






                <button
                    type="submit"
                    className="login-btn"
                >

                    {
                        loading
                        ? "Loading..."
                        : "Login"
                    }

                </button>






                <p className="auth-link">

                    Don't have an account?

                    <Link to="/register">
                        Register
                    </Link>

                </p>

            </form>

        </div>
    )
}

export default Login