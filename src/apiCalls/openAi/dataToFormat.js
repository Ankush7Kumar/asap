const axios = require("axios");

async function dataToFormat(query, outputText, apiKey) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo", 
        messages: [
          {
            role: "system", 
            content: "You are a product specification assistant that extracts detailed product information and returns the data in JSON format.",
          },
          {
            role: "user",
            content: `Extract the following details from the text provided below for the product described in the query:

Query: ${query}

Output Text: ${outputText}

Return the information in the following JSON format:

{Manufacturer Name: "", "Part Number": "", "Category": "", "Attributes": "" }

If a field cannot be determined, use 'Not available' as the value.`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.1,
        functions: [
          {
            name: "extract_product_info",
            description: "Extracts product details and returns them in JSON format.",
            parameters: {
              type: "object",
              properties: {
                ManufacturerName: { type: "string" },
                PartNumber: { type: "string" },
                Category: { type: "string" },
                Attributes: { type: "string" }
              },
              required: ["ManufacturerName", "PartNumber", "Category", "Attributes"]
            }
          }
        ],
        function_call: { name: "extract_product_info" },
      },
      { 
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return the structured JSON response
    return response.data.choices[0].message.function_call.arguments;
  } catch (error) {
    console.error("dataToFormat.js: Error during OpenAI API call:", error.response?.data || error);
    throw error;
  }
}

// Export the function for external use
module.exports = dataToFormat;
