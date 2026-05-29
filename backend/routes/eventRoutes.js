const express = require("express")
const {
    addReviewComment,
    getProposalComments,
    getProposalHistory
} = require("../controllers/eventController")

const {
    createEventProposal,
    getAllEventProposals,
    getSingleProposal,
    updateProposal,
    deleteProposal
} = require("../controllers/eventController")

const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

// CREATE EVENT
router.post(
    "/",
    authMiddleware,
    createEventProposal
)

// GET ALL EVENTS
router.get(
    "/",
    authMiddleware,
    getAllEventProposals
)

// GET SINGLE EVENT
router.get(
    "/:id",
    authMiddleware,
    getSingleProposal
)

// UPDATE EVENT
router.put(
    "/:id",
    authMiddleware,
    updateProposal
)

// DELETE EVENT
router.delete(
    "/:id",
    authMiddleware,
    deleteProposal
)

router.post(
    "/:id/comments",
    authMiddleware,
    addReviewComment
)

router.get(
    "/:id/comments",
    authMiddleware,
    getProposalComments
)

router.get(
    "/:id/history",
    authMiddleware,
    getProposalHistory
)

module.exports = router