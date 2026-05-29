import { Navigate } from "react-router-dom"

const ProtectedRoute = ({
    children,
    allowedRoles
}) => {

    const token =
        localStorage.getItem("token")

    const storedUser =
        localStorage.getItem("user")

    const user =
        storedUser
            ? JSON.parse(storedUser)
            : null





    // No Login
    if (!token || !user) {

        return <Navigate to="/login" />
    }






    // Role Restriction
    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {

        return <Navigate to="/login" />
    }






    return children
}

export default ProtectedRoute