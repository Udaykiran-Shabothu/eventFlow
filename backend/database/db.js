const path = require("path")

const sqlite3 = require("sqlite3")

const { open } = require("sqlite")

const fs = require("fs")





const dbPath = path.join(
    __dirname,
    "../eventManagement.db"
)

const schemaPath = path.join(
    __dirname,
    "schema.sql"
)

let db = null






const initializeDB = async () => {

    if (db) {
        return db
    }

    try {

        db = await open({

            filename: dbPath,

            driver: sqlite3.Database
        })

        console.log(
            "Connected to SQLite Database"
        )






        const schema =
            fs.readFileSync(
                schemaPath,
                "utf-8"
            )

        await db.exec(schema)

        console.log(
            "Tables Created Successfully"
        )






        return db

    } catch (error) {

        console.log(
            "DB Error:",
            error.message
        )

        process.exit(1)
    }
}






const getDB = () => {

    if (!db) {

        throw new Error(
            "Database not initialized"
        )
    }

    return db
}






module.exports = {
    initializeDB,
    getDB
}