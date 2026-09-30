const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const OFFICER_USERNAME = "officer";
const OFFICER_PASSWORD = "jansaathi123";

router.post("/login", (req, res) => {
    try {
        const { username, password } = req.body;

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
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            message: "Login successful",
            token: token
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed"
        });
    }
});

module.exports = router;