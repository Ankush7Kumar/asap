// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const processInput = require("./index"); // Ensure this path matches the location of the processInput method
require("dotenv").config({ path: "./.env" });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors");

// Allow all origins
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Route to test processInput
app.post("/api/test", async (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Input field is required." });
  }
 
  try {
    console.log(`Processing input: ${input}`);
    const result = await processInput(input);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error(`Error processing input: ${error.message}`);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

