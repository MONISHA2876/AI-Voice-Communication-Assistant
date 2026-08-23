const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/test", (req, res) => {
  res.json({
    message: "Test endpoint reached successfully!",
  });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server is running on port 5000");
});