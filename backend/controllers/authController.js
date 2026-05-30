const jwt = require("jsonwebtoken")

const bcrypt = require("bcrypt")

const { getDB } =
require("../database/db")




// REGISTER USER
const registerUser = async (req, res) => {

    const db = getDB()

    try {

        const {
            name,
            email,
            password,
            role,
            department_id
        } = req.body





        // VALIDATION
        if (
            !name ||
            !email ||
            !password ||
            !role ||
            !department_id
        ) {

            return res.status(400).json({
                error:
                "All fields are required"
            })
        }






        // CHECK EMAIL EXISTS
        const checkUserQuery = `
            SELECT *
            FROM users
            WHERE email = ?
        `

        const existingUser =
            await db.get(
                checkUserQuery,
                [email]
            )






        if (existingUser) {

            return res.status(400).json({
                error:
                "Email already exists"
            })
        }






        // INSERT USER
        const insertUserQuery = `
            INSERT INTO users
            (
                name,
                email,
                password,
                role,
                department_id
            )
            VALUES (?, ?, ?, ?, ?)
        `

        // 
        
        const hashedPassword =
    await bcrypt.hash(password, 10)

await db.run(
    insertUserQuery,
    [
        name,
        email,
        hashedPassword,
        role,
        department_id
    ]
)






        return res.status(201).json({
            message:
            "User registered successfully"
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            error:
            "Server Error"
        })
    }
}









// LOGIN USER
const loginUser = async (req, res) => {

    const db = getDB()

    try {

        const {
            email,
            password
        } = req.body





        // VALIDATION
        if (!email || !password) {

            return res.status(400).json({
                error:
                "Email and password required"
            })
        }






        // FIND USER
        const getUserQuery = `
            SELECT *
            FROM users
            WHERE email = ?
        `

        const user =
            await db.get(
                getUserQuery,
                [email]
            )






        // USER NOT FOUND
        if (!user) {

            return res.status(401).json({
                error:
                "Invalid email or password"
            })
        }






        // PASSWORD CHECK
        // if (password !== user.password) {

        //     return res.status(401).json({
        //         error:
        //         "Invalid email or password"
        //     })
        // }

        const isPasswordMatched =
    await bcrypt.compare(
        password,
        user.password
    )

if (!isPasswordMatched) {

    return res.status(401).json({
        error:
        "Invalid email or password"
    })
}






        // JWT TOKEN
        const payload = {
            id: user.id,
            role: user.role
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )






        // RESPONSE
        return res.status(200).json({

            token,

            user: {

                id: user.id,

                name: user.name,

                email: user.email,

                role: user.role,

                department_id:
                user.department_id
            }
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            error:
            "Server Error"
        })
    }
}


const getCoordinators = async (req, res) => {

    try {

        const db = getDB()

        const coordinators = await db.all(`
            SELECT
                id,
                name,
                email
            FROM users
            WHERE role='coordinator'
        `)

        res.json(coordinators)

    } catch (error) {

        res.status(500).json({
            error: error.message
        })
    }
}






module.exports = {
    registerUser,
    loginUser,
    getCoordinators
}