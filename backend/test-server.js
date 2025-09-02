import express from "express";

const app = express();

app.get("/", (req, res) => res.send("Hello world"));

const PORT = 5050;
app.listen(PORT, () => console.log("✅ Express running on {PORT}"));