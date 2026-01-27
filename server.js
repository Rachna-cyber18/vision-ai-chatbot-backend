const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let appointments = []; // ⚠️ TEMP storage (see note below)

// BOOK APPOINTMENT
app.post("/appointment", (req, res) => {
  const { name, phone, date, time } = req.body;

  if (!name || !phone || !date || !time) {
    return res.status(400).json({ error: "Missing fields" });
  }

  appointments.push({ name, phone, date, time });
  res.json({ success: true });
});

// VIEW APPOINTMENTS
app.get("/appointments", (req, res) => {
  res.json(appointments);
});

// AI ROUTE (TEST RESPONSE)
app.post("/ask", (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.json({ reply: "Please ask something." });
  }

  // TEMP reply (replace with OpenAI later)
  res.json({ reply: "Clinic is open Mon–Sat, 9 AM to 7 PM." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
