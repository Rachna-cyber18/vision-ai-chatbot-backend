const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

// Node 18+ has fetch built-in on Render
const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   ROOT ROUTE (VERY IMPORTANT)
   =============================== */
app.get("/", (req, res) => {
  res.send("Clinic AI Backend Running");
});

/* ===============================
   AI CHAT ROUTE
   =============================== */
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.json({ answer: "No question received" });
  }

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

    const answer =
      data?.output?.[0]?.content?.[0]?.text ||
      "AI did not return a response.";

    res.json({ answer });

  } catch (err) {
    console.error(err);
    res.json({ answer: "AI error, please try later." });
  }
});

/* ===============================
   APPOINTMENT ROUTES
   =============================== */
app.post("/appointment", (req, res) => {
  const { name, phone, date, time } = req.body;

  if (!name || !phone || !date || !time) {
    return res.json({ message: "All fields required" });
  }

  const appointment = { name, phone, date, time };
  let appointments = [];

  if (fs.existsSync("appointments.json")) {
    appointments = JSON.parse(fs.readFileSync("appointments.json"));
  }

  appointments.push(appointment);
  fs.writeFileSync("appointments.json", JSON.stringify(appointments, null, 2));

  res.json({ message: "Appointment booked successfully" });
});

app.get("/appointments", (req, res) => {
  if (!fs.existsSync("appointments.json")) {
    return res.json([]);
  }

  const data = JSON.parse(fs.readFileSync("appointments.json"));
  res.json(data);
});

app.delete("/appointments/:index", (req, res) => {
  const index = req.params.index;

  if (!fs.existsSync("appointments.json")) {
    return res.json({ message: "No appointments found" });
  }

  let data = JSON.parse(fs.readFileSync("appointments.json"));
  data.splice(index, 1);

  fs.writeFileSync("appointments.json", JSON.stringify(data, null, 2));
  res.json({ message: "Deleted successfully" });
});

/* ===============================
   START SERVER
   =============================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
