const {
    initializeDB
} = require("../database/db")

// CREATE EVENT PROPOSAL
const createEventProposal = async (req, res) => {

    try {

        const db = await initializeDB()

        const {
            title,
            description,
            category,
            proposed_date,
            venue,
            estimated_budget,
            expected_audience,
            department_id,
            document_link
        } = req.body

        // Validation
        if (
            !title ||
            !description ||
            !category ||
            !proposed_date ||
            !venue
        ) {
            return res.status(400).json({
                error: "Required fields missing"
            })
        }

        // Budget validation
        if (estimated_budget < 0) {
            return res.status(400).json({
                error: "Budget cannot be negative"
            })
        }

        // Audience validation
        if (expected_audience <= 0) {
            return res.status(400).json({
                error: "Invalid audience count"
            })
        }

        // Duplicate event check
        const existingProposal = await db.get(
            `
            SELECT * FROM event_proposals
            WHERE title = ?
            AND proposed_date = ?
            `,
            [title, proposed_date]
        )

        if (existingProposal) {
            return res.status(400).json({
                error: "Duplicate proposal already exists"
            })
        }

        // Insert proposal
        const result = await db.run(
            `
            INSERT INTO event_proposals
            (
                title,
                description,
                category,
                proposed_date,
                venue,
                estimated_budget,
                expected_audience,
                department_id,
                document_link,
                organizer_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                title,
                description,
                category,
                proposed_date,
                venue,
                estimated_budget,
                expected_audience,
                department_id,
                document_link || null,
                req.user.id
            ]
        )

        // Add history
        await db.run(
            `
            INSERT INTO proposal_history
            (
                proposal_id,
                action,
                performed_by
            )
            VALUES (?, ?, ?)
            `,
            [
                result.lastID,
                "Proposal Created",
                req.user.id
            ]
        )

        res.status(201).json({
            message: "Proposal created successfully"
        })

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}









// GET ALL PROPOSALS
const getAllEventProposals = async (req, res) => {

    try {

        const db = await initializeDB()

        const {
            page = 1,
            limit = 10,
            status,
            department_id,
            category,
            title,
            start_date,
            end_date
        } = req.query

        const offset = (page - 1) * limit

        let query = `
            SELECT
                event_proposals.*,
                users.name AS organizer_name
            FROM event_proposals

            LEFT JOIN users
            ON users.id = event_proposals.organizer_id

            WHERE 1=1
        `

        const params = []

        // ROLE BASED ACCESS

        // ORGANIZER
        if (req.user.role === "organizer") {

            query += `
                AND organizer_id = ?
            `

            params.push(req.user.id)
        }

        // COORDINATOR
        // if (req.user.role === "coordinator") {

        //     query += `
        //         AND coordinator_id = ?
        //     `

        //     params.push(req.user.id)
        // }

        // FILTERS

        if (status) {

            query += `
                AND status = ?
            `

            params.push(status)
        }

        if (department_id) {

            query += `
                AND department_id = ?
            `

            params.push(department_id)
        }

        if (category) {

            query += `
                AND category = ?
            `

            params.push(category)
        }

        if (title) {

            query += `
                AND title LIKE ?
            `

            params.push(`%${title}%`)
        }

        if (start_date && end_date) {

            query += `
                AND proposed_date
                BETWEEN ? AND ?
            `

            params.push(start_date, end_date)
        }

        // ORDERING
        query += `
            ORDER BY created_at DESC
        `

        // PAGINATION
        query += `
            LIMIT ?
            OFFSET ?
        `

        params.push(Number(limit))
        params.push(Number(offset))

        const proposals = await db.all(
            query,
            params
        )

        // COUNT QUERY
        let countQuery = `
            SELECT COUNT(*) as total
            FROM event_proposals
            WHERE 1=1
        `

        const countParams = []

        // SAME ROLE RULES
        if (req.user.role === "organizer") {

            countQuery += `
                AND organizer_id = ?
            `

            countParams.push(req.user.id)
        }

        if (req.user.role === "coordinator") {

            countQuery += `
                AND coordinator_id = ?
            `

            countParams.push(req.user.id)
        }

        // SAME FILTERS
        if (status) {

            countQuery += `
                AND status = ?
            `

            countParams.push(status)
        }

        if (department_id) {

            countQuery += `
                AND department_id = ?
            `

            countParams.push(department_id)
        }

        if (category) {

            countQuery += `
                AND category = ?
            `

            countParams.push(category)
        }

        if (title) {

            countQuery += `
                AND title LIKE ?
            `

            countParams.push(`%${title}%`)
        }

        if (start_date && end_date) {

            countQuery += `
                AND proposed_date
                BETWEEN ? AND ?
            `

            countParams.push(start_date, end_date)
        }

        const totalResult = await db.get(
            countQuery,
            countParams
        )

        res.status(200).json({
            currentPage: Number(page),
            totalPages: Math.ceil(
                totalResult.total / limit
            ),
            totalRecords: totalResult.total,
            data: proposals
        })

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}





// GET SINGLE PROPOSAL
const getSingleProposal = async (req, res) => {

    try {

       const db = await initializeDB()
        const { id } = req.params

        const proposal = await db.get(
            `
            SELECT *
            FROM event_proposals
            WHERE id = ?
            `,
            [id]
        )

        if (!proposal) {

            return res.status(404).json({
                error: "Proposal not found"
            })
        }

        // ORGANIZER ACCESS
        if (
            req.user.role === "organizer" &&
            proposal.organizer_id !== req.user.id
        ) {

            return res.status(403).json({
                error: "Access denied"
            })
        }

        // COORDINATOR ACCESS
        if (
            req.user.role === "coordinator" &&
            proposal.coordinator_id !== req.user.id
        ) {

            return res.status(403).json({
                error: "Access denied"
            })
        }

        res.status(200).json(proposal)

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}



// UPDATE PROPOSAL
const updateProposal = async (req, res) => {

    try {

       const db = await initializeDB()
        const { id } = req.params

        // Find proposal
        const proposal = await db.get(
            `
            SELECT *
            FROM event_proposals
            WHERE id = ?
            `,
            [id]
        )

        // Proposal not found
        if (!proposal) {

            return res.status(404).json({
                error: "Proposal not found"
            })
        }

        // Allowed statuses
        const allowedStatuses = [
            "Pending",
            "In Review",
            "Changes Required",
            "Approved",
            "Rejected"
        ]

        // Get request body
        const {
            title,
            description,
            category,
            proposed_date,
            venue,
            estimated_budget,
            expected_audience,
            department_id,
            document_link,
            status,
            priority,
            coordinator_id
        } = req.body

        // Status validation
        if (
            status &&
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({
                error: "Invalid status"
            })
        }

        // Budget validation
        if (
            estimated_budget !== undefined &&
            estimated_budget < 0
        ) {

            return res.status(400).json({
                error: "Budget cannot be negative"
            })
        }

        // Audience validation
        if (
            expected_audience !== undefined &&
            expected_audience <= 0
        ) {

            return res.status(400).json({
                error: "Invalid audience count"
            })
        }

        // Venue validation
        if (
            venue !== undefined &&
            venue.trim() === ""
        ) {

            return res.status(400).json({
                error: "Venue cannot be empty"
            })
        }

        // ORGANIZER RULES
        if (req.user.role === "organizer") {

            // Only own proposal
            if (
                proposal.organizer_id !== req.user.id
            ) {

                return res.status(403).json({
                    error: "Access denied"
                })
            }

            // Editable only in pending
            if (
                proposal.status !== "Pending"
            ) {

                return res.status(400).json({
                    error:
                    "Cannot edit after review started"
                })
            }

            // Organizer cannot change workflow fields
            if (
                status ||
                priority ||
                coordinator_id
            ) {

                return res.status(403).json({
                    error:
                    "Organizer cannot update approval fields"
                })
            }
        }

        // COORDINATOR RULES
        if (req.user.role === "coordinator") {

            // Coordinator can only access assigned proposals
            if (
                proposal.coordinator_id !== req.user.id &&
                proposal.coordinator_id !== null
            ) {

                return res.status(403).json({
                    error:
                    "Proposal not assigned to coordinator"
                })
            }

            // Coordinator cannot edit proposal content
            const restrictedFields = [
                "title",
                "description",
                "category",
                "proposed_date",
                "venue",
                "estimated_budget",
                "expected_audience",
                "department_id",
                "document_link"
            ]

            const hasRestrictedUpdate =
                restrictedFields.some(
                    field =>
                        req.body[field] !== undefined
                )

            if (hasRestrictedUpdate) {

                return res.status(403).json({
                    error:
                    "Coordinator cannot modify proposal content"
                })
            }
        }

        // Duplicate title check
        if (
            title &&
            proposed_date
        ) {

            const duplicateProposal = await db.get(
                `
                SELECT *
                FROM event_proposals
                WHERE title = ?
                AND proposed_date = ?
                AND id != ?
                `,
                [
                    title,
                    proposed_date,
                    id
                ]
            )

            if (duplicateProposal) {

                return res.status(400).json({
                    error:
                    "Another proposal with same title and date already exists"
                })
            }
        }

        if (
    coordinator_id &&
    req.user.role !== "admin"
) {

    return res.status(403).json({
        error:
        "Only admin can assign coordinator"
    })
}

        // Update proposal
        await db.run(
            `
            UPDATE event_proposals
            SET
                title = ?,
                description = ?,
                category = ?,
                proposed_date = ?,
                venue = ?,
                estimated_budget = ?,
                expected_audience = ?,
                department_id = ?,
                document_link = ?,
                status = ?,
                priority = ?,
                coordinator_id = ?
            WHERE id = ?
            `,
            [
                title || proposal.title,

                description || proposal.description,

                category || proposal.category,

                proposed_date || proposal.proposed_date,

                venue || proposal.venue,

                estimated_budget ??
                proposal.estimated_budget,

                expected_audience ??
                proposal.expected_audience,

                department_id ||
                proposal.department_id,

                document_link ||
                proposal.document_link,

                status || proposal.status,

                priority || proposal.priority,

                coordinator_id ||
                proposal.coordinator_id,

                id
            ]
        )

        // Add proposal history
        await db.run(
            `
            INSERT INTO proposal_history
            (
                proposal_id,
                action,
                performed_by
            )
            VALUES (?, ?, ?)
            `,
            [
                id,
                status
                    ? `Status changed to ${status}`
                    : "Proposal updated",
                req.user.id
            ]
        )

        // Get updated proposal
        const updatedProposal = await db.get(
            `
            SELECT *
            FROM event_proposals
            WHERE id = ?
            `,
            [id]
        )

        res.status(200).json({
            message:
                "Proposal updated successfully",
            proposal: updatedProposal
        })

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}


// DELETE PROPOSAL
const deleteProposal = async (req, res) => {

    try {

        const db = await initializeDB()

        const { id } = req.params

        const proposal = await db.get(
            `
            SELECT *
            FROM event_proposals
            WHERE id = ?
            `,
            [id]
        )

        if (!proposal) {
            return res.status(404).json({
                error: "Proposal not found"
            })
        }

        // Only organizer owner
        if (
            proposal.organizer_id !== req.user.id
        ) {
            return res.status(403).json({
                error: "Access denied"
            })
        }

        // Only pending deletable
        if (
            proposal.status !== "Pending"
        ) {
            return res.status(400).json({
                error: "Cannot delete reviewed proposal"
            })
        }

        await db.run(
            `
            DELETE FROM event_proposals
            WHERE id = ?
            `,
            [id]
        )

        res.status(200).json({
            message: "Proposal deleted successfully"
        })

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}





const addReviewComment = async (req, res) => {

    try {

       const db = await initializeDB()

        const { id } = req.params

        const { comment } = req.body

        // Validation
        if (!comment || comment.trim() === "") {

            return res.status(400).json({
                error: "Comment is required"
            })
        }

        // Find proposal
        const proposal = await db.get(
            `
            SELECT *
            FROM event_proposals
            WHERE id = ?
            `,
            [id]
        )

        if (!proposal) {

            return res.status(404).json({
                error: "Proposal not found"
            })
        }

        // Only coordinator/admin can comment
        if (
            req.user.role !== "coordinator" &&
            req.user.role !== "admin"
        ) {

            return res.status(403).json({
                error:
                "Only reviewers can add comments"
            })
        }

        // Insert comment
        await db.run(
            `
            INSERT INTO review_comments
            (
                proposal_id,
                reviewer_id,
                comment
            )
            VALUES (?, ?, ?)
            `,
            [
                id,
                req.user.id,
                comment
            ]
        )

        // Add history entry
        await db.run(
            `
            INSERT INTO proposal_history
            (
                proposal_id,
                action,
                performed_by
            )
            VALUES (?, ?, ?)
            `,
            [
                id,
                "Review comment added",
                req.user.id
            ]
        )

        res.status(201).json({
            message:
                "Review comment added successfully"
        })

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}





const getProposalComments = async (req, res) => {

    try {

       const db = await initializeDB()

        const { id } = req.params

        // Check proposal
        const proposal = await db.get(
            `
            SELECT *
            FROM event_proposals
            WHERE id = ?
            `,
            [id]
        )

        if (!proposal) {

            return res.status(404).json({
                error: "Proposal not found"
            })
        }

        // Organizer access check
        if (
            req.user.role === "organizer" &&
            proposal.organizer_id !== req.user.id
        ) {

            return res.status(403).json({
                error: "Access denied"
            })
        }

        const comments = await db.all(
            `
            SELECT
                review_comments.*,
                users.name AS reviewer_name,
                users.role AS reviewer_role
            FROM review_comments

            LEFT JOIN users
            ON users.id = review_comments.reviewer_id

            WHERE proposal_id = ?

            ORDER BY created_at DESC
            `,
            [id]
        )

        res.status(200).json(comments)

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}





const getProposalHistory = async (req, res) => {

    try {

        const db = await initializeDB()

        const { id } = req.params

        // Check proposal
        const proposal = await db.get(
            `
            SELECT *
            FROM event_proposals
            WHERE id = ?
            `,
            [id]
        )

        if (!proposal) {

            return res.status(404).json({
                error: "Proposal not found"
            })
        }

        // Organizer access check
        if (
            req.user.role === "organizer" &&
            proposal.organizer_id !== req.user.id
        ) {

            return res.status(403).json({
                error: "Access denied"
            })
        }

        const history = await db.all(
            `
            SELECT
                proposal_history.*,
                users.name AS performed_by_name,
                users.role AS performer_role

            FROM proposal_history

            LEFT JOIN users
            ON users.id = proposal_history.performed_by

            WHERE proposal_id = ?

            ORDER BY created_at ASC
            `,
            [id]
        )

        res.status(200).json(history)

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }
}



module.exports = {
    createEventProposal,
    getAllEventProposals,
    getSingleProposal,
    updateProposal,
    deleteProposal,

    addReviewComment,
    getProposalComments,
    getProposalHistory
}