const bcrypt = require("bcrypt")

const {
    initializeDB,
    getDB
} = require("./db")





const seedDatabase = async () => {

    try {

        await initializeDB()

        const db = getDB()






        // DEPARTMENTS
        const departments = [

            "Computer Science",

            "Mechanical",

            "Civil",

            "Electronics",

            "Business Administration"
        ]






        for (const department of departments) {

            const existingDepartment =
                await db.get(
                    `
                    SELECT *
                    FROM departments
                    WHERE name = ?
                    `,
                    [department]
                )

            if (!existingDepartment) {

                await db.run(
                    `
                    INSERT INTO departments
                    (name)
                    VALUES (?)
                    `,
                    [department]
                )
            }
        }

        console.log(
            "Departments Seeded"
        )






        // ADMIN
        const adminExists =
            await db.get(
                `
                SELECT *
                FROM users
                WHERE email = ?
                `,
                ["admin@gmail.com"]
            )

        if (!adminExists) {

            const hashedPassword =
                await bcrypt.hash(
                    "admin123",
                    10
                )

            await db.run(
                `
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    role
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    "System Admin",
                    "admin@gmail.com",
                    hashedPassword,
                    "admin"
                ]
            )
        }






        // COORDINATOR
        const coordinatorExists =
            await db.get(
                `
                SELECT *
                FROM users
                WHERE email = ?
                `,
                ["coordinator@gmail.com"]
            )

        if (!coordinatorExists) {

            const hashedPassword =
                await bcrypt.hash(
                    "coordinator123",
                    10
                )

            await db.run(
                `
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    role
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    "Main Coordinator",
                    "coordinator@gmail.com",
                    hashedPassword,
                    "coordinator"
                ]
            )
        }






        console.log(
            "Database Seeding Completed"
        )

        process.exit(0)

    } catch (error) {

        console.log(error.message)

        process.exit(1)
    }
}






seedDatabase()