const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ask", async (req,res)=>{
    const question = req.body.question;
    try{
        const response = await fetch("https://api.openai.com/v1/responses",{
            method:"POST",
            headers:{
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ model:"gpt-4.1-mini", input:`You are a clinic assistant for Dr. A. Sharma.\nUser: ${question}` })
        });
        const data = await response.json();
        const answer = data?.output?.[0]?.content?.[0]?.text || "No response";
        res.json({ answer });
    } catch { res.json({ answer:"AI error, try later." }); }
});

app.post("/appointment", (req,res)=>{
    const { name, phone, date, time } = req.body;
    const appointment = { name, phone, date, time };
    let appointments = [];
    if(fs.existsSync("appointments.json")) appointments = JSON.parse(fs.readFileSync("appointments.json"));
    appointments.push(appointment);
    fs.writeFileSync("appointments.json", JSON.stringify(appointments,null,2));
    res.json({ message:"Appointment booked" });
});

app.get("/appointments",(req,res)=>{
    if(!fs.existsSync("appointments.json")) return res.json([]);
    const data = JSON.parse(fs.readFileSync("appointments.json"));
    res.json(data);
});

app.delete("/appointments/:index",(req,res)=>{
    const idx = req.params.index;
    if(!fs.existsSync("appointments.json")) return res.json({ message:"No appointments" });
    let data = JSON.parse(fs.readFileSync("appointments.json"));
    data.splice(idx,1);
    fs.writeFileSync("appointments.json", JSON.stringify(data,null,2));
    res.json({ message:"Deleted" });
});

app.listen(3000,()=>console.log("Server running on http://localhost:3000"));
