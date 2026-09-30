const express = require("express");
const { getDB } = require("../database");
const { analyzeComplaint } = require("../gemini");
const { ObjectId } = require("mongodb");

const router = express.Router();

// Helper to generate readable tracking code e.g. JS-8492
function generateTrackingCode() {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `JS-${randomDigits}`;
}

// Submit citizen complaint
router.post("/", async (req, res) => {
    try {
        const { complaintText, language } = req.body;

        if (!complaintText || !language) {
            return res.status(400).json({
                message: "Complaint text and language are required"
            });
        }

        // Analyze via Gemini AI
        const aiResult = await analyzeComplaint(
            complaintText,
            language
        );

        const db = getDB();
        const trackingCode = generateTrackingCode();

        const complaint = {
            trackingCode,
            complaintText,
            language,
            category: aiResult.category || "other",
            urgency: aiResult.urgency || "medium",
            department: aiResult.department || "Municipal Grievance Cell",
            reply: aiResult.reply || "Your complaint has been submitted successfully.",
            status: "New",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db
            .collection("complaints")
            .insertOne(complaint);

        res.status(201).json({
            message: "Complaint analyzed and submitted successfully",
            complaint: {
                id: result.insertedId,
                trackingCode,
                complaintText,
                language,
                category: complaint.category,
                urgency: complaint.urgency,
                department: complaint.department,
                reply: complaint.reply,
                status: complaint.status,
                createdAt: complaint.createdAt
            }
        });

    } catch (error) {
        console.error("Complaint submission error:", error);

        res.status(500).json({
            message: "Failed to analyze or submit complaint"
        });
    }
});

// Fetch all complaints with optional filtering
router.get("/", async (req, res) => {
    try {
        const { status, category, urgency, search } = req.query;
        const db = getDB();

        let filter = {};

        if (status && status !== "All") {
            filter.status = status;
        }

        if (category && category !== "All") {
            filter.category = category.toLowerCase();
        }

        if (urgency && urgency !== "All") {
            filter.urgency = urgency.toLowerCase();
        }

        if (search && search.trim() !== "") {
            const searchRegex = new RegExp(search.trim(), "i");
            filter.$or = [
                { complaintText: searchRegex },
                { trackingCode: searchRegex },
                { department: searchRegex },
                { category: searchRegex }
            ];
        }

        const complaints = await db
            .collection("complaints")
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray();

        res.json(complaints);

    } catch (error) {
        console.error("Error fetching complaints:", error);

        res.status(500).json({
            message: "Failed to fetch complaints"
        });
    }
});

// Track single complaint by ID or tracking code
router.get("/track/:query", async (req, res) => {
    try {
        const { query } = req.params;
        const db = getDB();

        let searchCondition = { trackingCode: query.trim().toUpperCase() };

        if (ObjectId.isValid(query)) {
            searchCondition = {
                $or: [
                    { _id: new ObjectId(query) },
                    { trackingCode: query.trim().toUpperCase() }
                ]
            };
        }

        const complaint = await db.collection("complaints").findOne(searchCondition);

        if (!complaint) {
            return res.status(404).json({
                message: "No complaint found with this Tracking ID or Code"
            });
        }

        res.json(complaint);

    } catch (error) {
        console.error("Error tracking complaint:", error);
        res.status(500).json({
            message: "Error retrieving complaint tracking information"
        });
    }
});

// Update complaint status
router.patch("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "New",
            "In Progress",
            "Resolved"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const db = getDB();

        let query = { trackingCode: id };
        if (ObjectId.isValid(id)) {
            query = {
                $or: [
                    { _id: new ObjectId(id) },
                    { trackingCode: id }
                ]
            };
        }

        const result = await db
            .collection("complaints")
            .updateOne(
                query,
                {
                    $set: {
                        status: status,
                        updatedAt: new Date()
                    }
                }
            );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.json({
            message: "Complaint status updated successfully",
            status: status
        });

    } catch (error) {
        console.error("Error updating complaint:", error);

        res.status(500).json({
            message: "Failed to update complaint status"
        });
    }
});

module.exports = router;