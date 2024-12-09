const OpenAI = require("openai");
const getGoogleResults = require("./apiCalls/google/googleSearch");
const fetchRenderedBodyContent = require("./fetchRenderedDOM");
require("dotenv").config({ path: "./.env" });
const fs = require('fs');


// Ensure API keys are retrieved from environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Google API Key
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID; // Google Custom Search Engine ID
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // OpenAI API Key

if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID || !OPENAI_API_KEY) {
  console.error("Error: Missing required API keys. Please check your .env file.");
  process.exit(1);
}

// Log API keys for debugging (optional, remove in production)
/*
console.log("Google API Key:", GOOGLE_API_KEY);
console.log("Google CSE ID:", GOOGLE_CSE_ID);
console.log("OpenAI API Key:", OPENAI_API_KEY);
console.log("-------\n\n");
*/

(async () => {
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const input = "6205 2RS BRG";


  let messages = [
    {
      role: "system",
      content: `You are an assistant specialized in interpreting manufacturing industry inputs.`,
    },
    {
      role: "user",
      content: `Your task is to interpret the input (which talks about a manufacturing industry part) and in the end, print the specifications of this product talked about in the input. 
      The input may or may not contain part-number, manufacturer, category, and attributes used in the manufacturing parts industry. 
      You may take help from the given functions getGoogleResults to find the result of this input on Google and fetchRenderedBodyContent to get the HTML body of those URLs that result from getGoogleResults and read through them.
      
      Step 1 - Review the input, which is a raw data string I have provided and determine the manufacturer name and part number for the item. 

      Step 2 - Search the internet to provide a category and an exhaustive list of attributes and their values for the determined mfg name and part number from Step 1. Include attributes in categories such as General Product Specification, Physical Dimensions, Design and Construction, and Performance Characteristics. 

      Step 3 - Return the attributes from Step 2 in two different descriptions. 1. A combined comma separated description with the format of "Attribute label: attribute value, Attribute label: attribute value". 2. A combined comma separated description consisting of attribute values only Ex. attribute value, attribute value, attribute value

      `,
    },
    {
      role: "user",
      content: `Here is the input for your task: "${input}"`,
    },
  ];

  const functions = [
    {
      name: "getGoogleResults",
      description: "Fetches Google search results for a given query using Google API.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "The search query." },
          apiKey: { type: "string", description: "Google API key." },
          CX: { type: "string", description: "Custom Search Engine ID." },
        },
        required: ["query", "apiKey", "CX"],
      },
    },
    {
      name: "fetchRenderedBodyContent",
      description: "Fetches the rendered HTML body content from a given URL.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "The URL to fetch the HTML body from." },
        },
        required: ["url"],
      },
    },
  ];

  const callModel = async () => {
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages,
      functions,
      temperature: 0,
    });

    if (response.choices[0].finish_reason === "function_call") {
      const functionCall = response.choices[0].message.function_call;
      const { name, arguments: args } = functionCall;

      let functionResponse;
      if (name === "getGoogleResults") {
        const { query, apiKey, CX } = JSON.parse(args);
        functionResponse = await getGoogleResults(query, GOOGLE_API_KEY, GOOGLE_CSE_ID);
      } else if (name === "fetchRenderedBodyContent") {
        const { url } = JSON.parse(args);
        functionResponse = await fetchRenderedBodyContent(url);
      }

      const functionContent = typeof functionResponse === "object" ? JSON.stringify(functionResponse) : functionResponse;

      messages.push(response.choices[0].message);
      // Append the function's response to messages
      messages.push({
        role: "function",
        name: name,
        content: functionContent,
      });

      // Recursively call the model with updated messages
      return await callModel(messages);
    }

    return response;
  };

  try {
    const response = await callModel(messages);
    //console.log(messages)
    const stream = fs.createWriteStream('output.json', { flags: 'w' });
    stream.write(JSON.stringify(messages, null, 2));
    stream.end();
    console.log("\nFinal Response:");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error during API call:", error);
  }
})();
