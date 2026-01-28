const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// In-memory storage (safe, simple)
let appointments = [];

/* =========================
   HEALTH CHECK (IMPORTANT)
   ========================= */
app.get("/", (req, res) => {
  res.send("Clinic AI Backend is running ✅");
});

/* =========================
   BOOK APPOINTMENT
   ========================= */
app.post("/appointment", (req, res) => {
  try {
    const { name, phone, date, time } = req.body;

    if (!name || !phone || !date || !time) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    appointments.push({ name, phone, date, time });
    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =========================
   VIEW APPOINTMENTS
   ========================= */
app.get("/appointments", (req, res) => {
  res.json(appointments);
});

/* =========================
   AI CHAT ROUTE (NEVER FAILS)
   ========================= */
app.post("/ask", (req, res) => {
  try {
    const question = (req.body.question || "").toLowerCase();

    let reply = "I’m here to help you with clinic information and appointments 😊";

    if (question.includes("hi") || question.includes("hello")) {
      reply = "Hello 👋 How can I assist you today?";
    }
    else if (question.includes("time") || question.includes("open")) {
      reply = "The clinic is open Monday to Saturday, from 9 AM to 7 PM.";
    }
    else if (question.includes("doctor")) {
      reply = "Dr. A. Sharma (MBBS) is available during clinic hours.";
    }
    else if (question.includes("appointment")) {
      reply = "You can book an appointment using the 'Book Appointment' button above.";
    }
    else if (question.includes("location") || question.includes("address")) {
      reply = "Sharma Clinic is located in the city center. Please contact reception for directions.";
    }

    res.json({ reply });
  } catch (err) {
    // FINAL SAFETY NET — AI WILL NEVER STOP
    res.json({ reply: "I’m here 😊 Please ask your question again." });
  }
});

/* =========================
   SERVER START (RENDER SAFE)
   ========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Clinic AI backend running on port", PORT);
});
