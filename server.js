const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route for health check
app.get("/", (req, res) => {
    res.send("Clinic AI Backend Running");
});

// Ask AI route
app.post("/ask", async (req, res) => {
    const question = req.body.question;

    try {
        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                input: `You are a clinic assistant for Dr. A. Sharma.\nUser: ${question}`
            })
        });

        const data = await response.json();
        const reply = data?.output?.[0]?.content?.[0]?.text || "Sorry, I could not respond right now.";
        res.json({ reply });
    } catch (err) {
        res.json({ reply: "AI error, please try later." });
    }
});

// Book appointment
app.post("/appointment", (req, res) => {
    const { name, phone, date, time } = req.body;
    if (!name || !phone || !date || !time) return res.json({ message: "All fields required" });

    const appointment = { name, phone, date, time };
    let appointments = [];
    if (fs.existsSync("appointments.json")) {
        appointments = JSON.parse(fs.readFileSync("appointments.json"));
    }
    appointments.push(appointment);
    fs.writeFileSync("appointments.json", JSON.stringify(appointments, null, 2));

    res.json({ message: "Appointment booked successfully" });
});

// Get all appointments
app.get("/appointments", (req, res) => {
    if (!fs.existsSync("appointments.json")) return res.json([]);
    const data = JSON.parse(fs.readFileSync("appointments.json"));
    res.json(data);
});

// Delete appointment
app.delete("/appointments/:index", (req, res) => {
    const idx = parseInt(req.params.index);
    if (!fs.existsSync("appointments.json")) return res.json({ message: "No appointments found" });

    let data = JSON.parse(fs.readFileSync("appointments.json"));
    if (idx >= 0 && idx < data.length) {
        data.splice(idx, 1);
        fs.writeFileSync("appointments.json", JSON.stringify(data, null, 2));
        return res.json({ message: "Deleted successfully" });
    } else {
        return res.json({ message: "Invalid index" });
    }
});

// Start server on Render assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
