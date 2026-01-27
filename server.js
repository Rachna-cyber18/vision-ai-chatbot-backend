import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* Root route (Render health check) */
app.get("/", (req, res) => {
  res.send("Clinic AI Backend Running");
});

/* AI Route */
app.post("/ask", (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.json({ reply: "Please ask a question." });
  }

  // Stable mock AI (no API delays)
  const aiReply = `Thank you for your question. Our clinic team will assist you regarding: "${question}"`;

  res.json({ reply: aiReply });
});

/* Appointment Route */
app.post("/appointment", (req, res) => {
  res.json({
    reply: "Appointment booked successfully",
    appointment: "Booked successfully"
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

