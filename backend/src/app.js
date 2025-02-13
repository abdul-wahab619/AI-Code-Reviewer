const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/ai.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRoutes);
app.use("/ai", aiRoutes);
module.exports = app;
