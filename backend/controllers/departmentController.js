const {
    getDB
} = require("../database/db")




// GET ALL DEPARTMENTS
const getAllDepartments = async (req, res) => {

    try {

        const db = getDB()

        const departments = await db.all(
            `
            SELECT *
            FROM departments
            ORDER BY name ASC
            `
        )

        res.status(200).json(departments)

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}









// CREATE DEPARTMENT
const createDepartment = async (req, res) => {

    try {

        const db = getDB()

        const { name } = req.body

        // Validation
        if (!name || name.trim() === "") {

            return res.status(400).json({
                error: "Department name required"
            })
        }

        // Duplicate check
        const existingDepartment = await db.get(
            `
            SELECT *
            FROM departments
            WHERE name = ?
            `,
            [name]
        )

        if (existingDepartment) {

            return res.status(400).json({
                error:
                "Department already exists"
            })
        }

        // Insert department
        await db.run(
            `
            INSERT INTO departments
            (name)
            VALUES (?)
            `,
            [name]
        )

        res.status(201).json({
            message:
            "Department created successfully"
        })

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}

module.exports = {
    getAllDepartments,
    createDepartment
}