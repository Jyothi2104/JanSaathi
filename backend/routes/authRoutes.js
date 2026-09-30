const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const OFFICER_USERNAME = "officer";
const OFFICER_PASSWORD = "jansaathi123";

// Officer Login Route
router.post("/login", (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        if (
            username !== OFFICER_USERNAME ||
            password !== OFFICER_PASSWORD
        ) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                username: username,
                role: "officer"
            },
            process.env.JWT_SECRET || "jansaathi_jwt_secret_key",
            {
                expiresIn: "12h"
            }
        );

        res.json({
            message: "Login successful",
            token: token,
            officer: {
                username: username,
                role: "officer"
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Login process failed"
        });
    }
});

// Middleware to verify JWT for protected officer routes
function verifyOfficerToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authorization token required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "jansaathi_jwt_secret_key"
        );
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}

// Verification route to validate current token
router.get("/me", verifyOfficerToken, (req, res) => {
    res.json({
        valid: true,
        user: req.user
    });
});

module.exports = router;
module.exports.verifyOfficerToken = verifyOfficerToken;