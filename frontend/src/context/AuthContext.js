import {
    createContext,
    useState
} from "react"

export const AuthContext =
    createContext()

const AuthProvider = ({
    children
}) => {

    const [token, setToken] =
        useState(
            localStorage.getItem("token")
            || null
        )

    let storedUser = null

    try {

        const userData =
            localStorage.getItem("user")

        storedUser =
            userData &&
            userData !== "undefined"
                ? JSON.parse(userData)
                : null

    } catch (error) {

        storedUser = null
    }

    const [user, setUser] =
        useState(storedUser)






    // LOGIN
    const login = (
        tokenData,
        userData
    ) => {

        localStorage.setItem(
            "token",
            tokenData
        )

        if (userData) {

            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            )
        }

        setToken(tokenData)

        setUser(userData)
    }






    // LOGOUT
    const logout = () => {

        localStorage.removeItem("token")

        localStorage.removeItem("user")

        setToken(null)

        setUser(null)
    }






    return (

        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>
    )
}

export default AuthProvider