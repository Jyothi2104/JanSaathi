const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./database");
const complaintRoutes = require("./routes/complaintRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/complaints", complaintRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "JanSaathi backend is running!"
    });
});

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(
            `JanSaathi backend running on http://localhost:${PORT}`
        );
    });
}

startServer();