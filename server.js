const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// =========================
// MIDDLEWARES
// =========================
app.use(cors());
app.use(express.json());

// =========================
// SERVE FRONTEND (IMPORTANT)
// =========================
app.use(express.static(path.join(__dirname, "public")));

// =========================
// IN-MEMORY STORAGE
// =========================
let appointments = [];

// =========================
// HEALTH CHECK
// =========================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =========================
// BOOK APPOINTMENT
// =========================
app.post("/appointment", (req, res) => {
  try {
    const { name, phone, date, time } = req.body;

    if (!name || !phone || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    appointments.push({ name, phone, date, time });

    res.json({
      success: true,
      message: "Appointment booked successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// =========================
// VIEW APPOINTMENTS
// =========================
app.get("/appointments", (req, res) => {
  res.json(appointments);
});

// =========================
// AI CHAT ROUTE
// =========================
app.post("/ask", (req, res) => {
  try {
    const question = (req.body.question || "").toLowerCase().trim();

    if (!question) {
      return res.json({ reply: "Please ask a question 😊" });
    }

    let reply =
      "I’m here to help you with clinic information and appointments 😊";

    if (question.includes("hi") || question.includes("hello")) {
      reply = "Hello 👋 How can I assist you today?";
    } else if (
      question.includes("time") ||
      question.includes("open") ||
      question.includes("timing")
    ) {
      reply = "The clinic is open Monday to Saturday, from 9 AM to 7 PM.";
    } else if (question.includes("doctor")) {
      reply = "Dr. A. Sharma (MBBS) is available during clinic hours.";
    } else if (question.includes("appointment")) {
      reply =
        "You can book an appointment using the 'Book Appointment' button above.";
    } else if (
      question.includes("location") ||
      question.includes("address")
    ) {
      reply =
        "Sharma Clinic is located in the city center. Please contact reception for directions.";
    }

    res.json({ reply });
  } catch (err) {
    res.json({
      reply: "I’m here 😊 Please ask your question again."
    });
  }
});

// =========================
// FALLBACK (IMPORTANT)
// =========================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =========================
// SERVER START
// =========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Clinic AI backend running on port", PORT);
});
