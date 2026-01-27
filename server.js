const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   ROOT ROUTE (Render health check)
   =============================== */
app.get("/", (req, res) => {
  res.send("Clinic AI Backend Running");
});

/* ===============================
   AI CHAT ROUTE
   =============================== */
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.json({ reply: "Please ask a question." });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: question
      })
    });

    const data = await response.json();

    const aiReply =
      data?.output?.[0]?.content?.[0]?.text ||
      "Sorry, I could not respond right now.";

    res.json({ reply: aiReply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server busy, please try again." });
  }
});

/* ===============================
   APPOINTMENT ROUTE
   =============================== */
app.post("/appointment", (req, res) => {
  const { name, phone, date } = req.body;

  if (!name || !phone || !date) {
    return res.json({ message: "All fields are required" });
  }

  const appointment = { name, phone, date };
  let data = [];

  if (fs.existsSync("appointments.json")) {
    data = JSON.parse(fs.readFileSync("appointments.json"));
  }

  data.push(appointment);
  fs.writeFileSync("appointments.json", JSON.stringify(data, null, 2));

  res.json({ message: "Appointment booked successfully" });
});

/* ===============================
   START SERVER
   =============================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
