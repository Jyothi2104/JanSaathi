const express = require("express");
const { getDB } = require("../database");
const { analyzeComplaint } = require("../gemini");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { complaintText, language } = req.body;

        if (!complaintText || !language) {
            return res.status(400).json({
                message: "Complaint text and language are required"
            });
        }

        // Send complaint to Gemini
        const aiResult = await analyzeComplaint(
            complaintText,
            language
        );

        const db = getDB();

        // Create complaint with AI analysis
        const complaint = {
            complaintText,
            language,
            category: aiResult.category,
            urgency: aiResult.urgency,
            department: aiResult.department,
            reply: aiResult.reply,
            status: "New",
            createdAt: new Date()
        };

        // Save to MongoDB
        const result = await db
            .collection("complaints")
            .insertOne(complaint);

        res.status(201).json({
            message: "Complaint analyzed and submitted successfully",

            complaint: {
                id: result.insertedId,
                complaintText,
                language,
                category: aiResult.category,
                urgency: aiResult.urgency,
                department: aiResult.department,
                reply: aiResult.reply,
                status: "New"
            }
        });

    } catch (error) {
        console.error("Complaint submission error:", error);

        res.status(500).json({
            message: "Failed to analyze or submit complaint"
        });
    }
});
// Get all complaints
router.get("/", async (req, res) => {
    try {
        const db = getDB();

        const complaints = await db
            .collection("complaints")
            .find()
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

        const { ObjectId } = require("mongodb");

        const result = await db
            .collection("complaints")
            .updateOne(
                { _id: new ObjectId(id) },
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