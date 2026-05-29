import { useContext } from "react"

import { Link, useNavigate } from "react-router-dom"

import { AuthContext } from "../../context/AuthContext"

import "./index.css"

const Navbar = () => {

    const navigate = useNavigate()

    const { user, logout } = useContext(AuthContext)





    const handleLogout = () => {

        logout()

        navigate("/")
    }






    return (

        <nav className="navbar">

            <h1 className="logo">
                Event Portal
            </h1>






            <ul className="nav-links">




                {
                    user?.role ===
                    "organizer" && (

                        <>

                            <li>

                                <Link to="/organizer">
                                    Dashboard
                                </Link>

                            </li>

                            <li>

                                <Link
                                    to="/create-proposal"
                                >
                                    Create Proposal
                                </Link>

                            </li>

                            <li>

                                <Link
                                    to="/my-proposals"
                                >
                                    My Proposals
                                </Link>

                            </li>

                        </>
                    )
                }






                {
                    user?.role ===
                    "coordinator" && (

                        <>

                            <li>

                                <Link
                                    to="/coordinator"
                                >
                                    Review Queue
                                </Link>

                            </li>

                        </>
                    )
                }






                {
                    user?.role ===
                    "admin" && (

                        <>

                            <li>

                                <Link to="/admin">
                                    Dashboard
                                </Link>

                            </li>

                        </>
                    )
                }






                <li>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </li>

            </ul>

        </nav>
    )
}

export default Navbar