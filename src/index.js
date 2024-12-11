const OpenAI = require("openai");
const getGoogleResults = require("./apiCalls/google/googleSearch");
//const fetchRenderedBodyContent = require("./fetchRenderedDOM");
const fetchDataFromRenderedBodyContent = require("./fetchRenderedDOM");
require("dotenv").config({ path: "./.env" });
const fs = require('fs');


// Ensure API keys are retrieved from environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Google API Key
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID; // Google Custom Search Engine ID
//const GOOGLE_CSE_ID_2 = process.env.GOOGLE_CSE_ID_2; // Google Custom Search Engine ID
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

  //const input = "6205 2RS BRG"; 
  //const input = "STRAP BLADDER 12 X .625G OPEN CLAMP";
  const input = "IPTCI NO. NAP 211-32";

  console.log("Query: ",input);
  


  let messages = [
    {
      role: "system",
      content: `You are an assistant specialized in interpreting manufacturing industry inputs.`,
    },
    {
      role: "user",
      content: `
      Step 1 - Review the input, which is a raw data string I have provided and determine the manufacturer name and part number for the item. 

      Step 2 - Search the internet to provide a category and an exhaustive list of attributes and their values for the determined mfg name and part number from Step 1. Include attributes in categories such as General Product Specification, Physical Dimensions, Design and Construction, and Performance Characteristics. 

      Step 3 - Return the attributes from Step 2 in two different descriptions. 1. A combined comma separated description with the format of "Attribute label: attribute value, Attribute label: attribute value". 2. A combined comma separated description consisting of attribute values only Ex. attribute value, attribute value, attribute value

      Keep trying the websites until you get specifications.
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
          //CX2: { type: "string", description: "Custom Search Engine ID 2." },
        },
        required: ["query", "apiKey", "CX", /*"CX2"*/],
      },
    },
    {
      name: "fetchDataFromRenderedBodyContent",
      description: "Fetches the rendered HTML body content from a given URL, then extracts specifications of the product from that HTML body content. Then returns that specification information.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "The URL to fetch the product specification information from." },
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
        const { query, apiKey, CX/*, CX2*/ } = JSON.parse(args);
        functionResponse = await getGoogleResults(query, GOOGLE_API_KEY, GOOGLE_CSE_ID/*, GOOGLE_CSE_ID_2*/);
      } else if (name === "fetchDataFromRenderedBodyContent") {
        const { url } = JSON.parse(args);
        functionResponse = await fetchDataFromRenderedBodyContent(url);
      }

      const functionContent = typeof functionResponse === "object" ? JSON.stringify(functionResponse) : functionResponse;

      messages.push(response.choices[0].message);
      console.log("\n>>message is \n",response.choices[0].message,"\n")
      console.log("Function content: \n", functionContent, "\n\n<<")
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
    console.log("\nmessages.length: ",messages.length,"\n\n")
    
    /*
    messages = messages.map((message) => {
      if (message.role === 'function' && message.name === 'fetchDataFromRenderedBodyContent') {
        return {
          ...message,
          content: message.content.slice(0, 100), // Truncate to 100 characters
        };
      }
      return message;
    });
    */
    
    //console.log(messages)
    const stream = fs.createWriteStream('output.json', { flags: 'w' });
    stream.write(JSON.stringify(messages, null, 2));
    stream.end();
    console.log("\n\nFinal Response:");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error during API call:", error);
  }
})();
