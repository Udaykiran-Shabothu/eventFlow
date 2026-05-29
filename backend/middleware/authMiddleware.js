const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({
                error: "Token missing"
            })
        }

        const token = authHeader.split(" ")[1]

        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (error, payload) => {

                if (error) {
                    return res.status(401).json({
                        error: "Invalid token"
                    })
                }

                req.user = payload

                next()
            }
        )

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}

module.exports = authMiddleware