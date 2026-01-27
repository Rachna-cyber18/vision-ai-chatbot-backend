import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* ===============================
   ROOT ROUTE (IMPORTANT FOR RENDER)
   =============================== */
app.get("/", (req, res) => {
  res.send("Clinic AI Backend Running");
});

/* ===============================
   ASK AI ROUTE
   =============================== */
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.json({ reply: "Please ask a valid question." });
  }

  try {
    // 🔹 MOCK AI RESPONSE (stable & fast)
    const aiResponse = `You asked: "${question}". Our clinic will assist you shortly.`;

    res.json({ reply: aiResponse });
  } catch (err) {
    res.json({ reply: "Server busy. Please try again." });
  }
});

/* ===============================
   BOOK APPOINTMENT ROUTE
   =============================== */
app.post("/appointment", (req, res) => {
  const { name, phone, date } = req.body;

  if (!name || !phone || !date) {
    return res.json({ message: "All fields are required" });
  }

  const newAppointment = { name, phone, date };

  let appointments = [];
  if (fs.existsSync("appointments.json")) {
    appointments = JSON.parse(fs.readFileSync("appointments.json"));
  }

  appointments.push(newAppointment);
  fs.writeFileSync("appointments.json", JSON.stringify(appointments, null, 2));

  res.json({
    reply: "Appointment booked successfully",
    appointment: "Booked successfully"
  });
});

/* ===============================
   VIEW APPOINTMENTS ROUTE
   =============================== */
app.get("/appointments", (req, res) => {
  if (!fs.existsSync("appointments.json")) {
    return res.json([]);
  }

  const data = JSON.parse(fs.readFileSync("appointments.json"));
  res.json(data);
});

/* ===============================
   START SERVER
   =============================== */
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
