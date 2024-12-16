const axios = require("axios");

async function checkIfSpecificationsFound(query, outputText, apiKey) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo", // Ensure you are using a valid model
        messages: [
          {
            role: "system",
            content: "You are a product specification assistant.",
          },
          {
            role: "user",
            content: `Does the following text contain product specifications for the product described in the query?\n\nQuery: ${query}\n\nOutput Text: ${outputText}\n\nAnswer "Yes" if it contains specifications, otherwise "No".`,
          },
        ],
        max_tokens: 10,
        temperature: 0.1,
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("checkIfSpecificationsFound.js: Error during OpenAI API call:", error.response?.data || error);
    throw error;
  }
}

// Export the function for external use
module.exports = checkIfSpecificationsFound;
