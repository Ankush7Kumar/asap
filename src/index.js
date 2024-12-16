const OpenAI = require("openai");
const getGoogleResults = require("./apiCalls/google/googleSearch");
const fetchDataFromRenderedBodyContent = require("./fetchRenderedDOM");
const checkIfSpecificationsFound = require("./apiCalls/openAi/checkIfSpecificationsFound");
require("dotenv").config({ path: "./.env" });
const fs = require("fs");

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Google API Key
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID; // Google Custom Search Engine ID
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // OpenAI API Key

if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID || !OPENAI_API_KEY) {
  console.error(
    "Error: Missing required API keys. Please check your .env file."
  );
  process.exit(1);
}

const inputArray = [
    "6205 2RS BRG",
    "STRAP BLADDER 12 X .625G OPEN CLAMP",
    "IPTCI NO. NAP 211-32",
    "L-SUPPORT .25D STEM/HOLE 28MML BRASS",
    "FASTENAL NO. 0140972",
    "PWHS NO. 8 X 1/2 SELF DRILL PLATED",
    "FASTENAL NO. 0162762",
    "CAM BOTTOM DRAW G-1000",
    "PMC NO. 41479-D",
    "HUB CAM 1000",
    "PMC NO. 81234-B",
    "WASHER 1000",
    "PMC NO. 81238-A",
    "THRUST WASHER 1.627B 3.25OD .125T",
    "PMC NO. 81235-A",
    "TORQUE COLLAR KIT POST/BHSCS",
    "MONTALVO NO. 18000620",
    "PAD SET BREAK ANTI-SQUEAL HIGH COEFFICIENT",
    "MONTALVO NO. MFP4512-GT",
    "TORQUE POST KIT W/ SCREW/STAR WASHER",
    "MONTALVO NO. 10000536",
    "PAD SET BRAKE DUAL FRICTION COEFFICIENT",
    "MONTALVO NO. 17001260",
    "BELT TIMING .50 PITCH 1.50W 68.00L 136 TEETH RUBBER",
    "JASON IND NO. 680H150",
    "EXTENSION BALANCE CYL 1.38D 5.50IN 1-14 THREAD",
    "LEOLA FAB NO. LF-B105446",
    "EXTENSION BALANCE CYL 1.38D 10.00L 1-14 THREAD",
    "LEOLA FAB NO. LF-B105447",
    "1.50 IN DIA 4140 HT TG&P TOLERANCE +.000/-.001 24 FT MAX LENGTH",
    "MAKE COMPLETE PER DESIGN INFORMATION",
    "FWHS NO. 8 X 3/4 PHILLIPS SELF-DRILL PHOSPHATE",
    "FASTENAL NO. 0162773",
    "HINGE 1.00H .38W 2 HOLE SURFACE MOUNT BRASS",
    "NON-REMOVABLE PIN",
    "MCMASTER CARR NO. 1603A3",
    "RING LTC .614ID .75OD .214L",
    "SCHULLER MACHINE NO. 20-101B",
    "ROLLER ASSY IDLER 58MMD 175MML ANOD ALUM",
    "VAN DAM MACHINE NO. CB-037394-A",
    "SPACER L7 PLATE .38B .75OD .875L STEEL",
    "LEOLA FAB NO. LF-A105448",
    "SPACER L7 PLATE .38B .75OD .50L STEEL",
    "LEOLA FAB NO. LF-A105449",
    "DISC HUB ASSY BRAKE CUSTOM",
    "MONTALVO NO. STDBR1000CUS",
    "BELT CONVEYOR 24.00W ACETAL W/RODS FLUSH BLUE",
    "NERCON NO. 1027356 M2540 RAD FLUSH BLUE ACETAL",
    "MAKE COMPLETE PER DESIGN INFORMATION",
    "SLEEVE ROLLER BEARING ADAPTER 85MMB 38MML",
    "125MMOD M95-2.0 THREAD",
    "FAG/SCHAEFFLER NO. H319",
    "MOTION INDS NO. 04682908",
    "DISC POWER LOCK SHRINK 18MMB 44MMOD",
    "15MMW 18.5MM OVERALL WIDTH",
    "FOR KF 060 GEARBOX",
    "APEX DYNAMICS NO. SSD-D18XDW15",
    "BELT CONVEYOR 12.00W 170.00L",
    "CLIPPER-LACE EACH",
    "BELT CONVEYOR 28.00W 210.00L",
    "CLIPPER-LACE EACH",
    "BELT CONVEYOR 28.00W 1077.00L",
    "CLIPPER-LACE EACH",
    "THREAD SEALING TAPE",
    "1/4 WIDE X 540 LENGTH",
    "1 ROLL I EACH",
    "CHESTERTON STYLE 800 GOLD END",
    "CHESTERTON NO. 000805",
    "STD ITEM DESCRIPTION:",
    "1.00 X 4.63 X 4.88",
    "A11 TSTL",
    "CUT TOLERANCE +.12/-0",
    "CUT EDGES MUST BE DEBURRED",
    "HAND SAFE",
    "DEUBLIN NO. Y141017",
    "INSULATION 2.00IPS .50W ARMAFLEX",
    "ARMACELL NO. ISL200IPS050SS",
    "GRBX WORM 15:1 C-FACE QUILL 56C FRAME",
    ".625D INPUT/DOUBLE OUTPUT RIGHT ANGLE",
    "BOSTON GEAR/ALTRA NO. HF718-15-B5-H-P16",
    "MOTION INDS NO. 01363761",
    "SYN PLLY 8MM PITCH 36MMW 140 TEETH",
    "3020 TAPER LOCK BUSH BORE",
    "GATES NO. 8MX-140S-36",
    "MOTION INDS NO. 02042834",
    "BROWN MACHINE NO. 504-05701",
    "ROD",
    "BEARING PILLOW BLOCK 2.00B 2.50W 8.625L CAST IRON",
    "CLAMP COLLAR 3.50B 5.00OD 1.00W EXTRA GRIP",
    "2 PIECE STEEL",
    "MCMASTER CARR NO. 8386K28",
    "INSERT BEARING .875B 1.85OD 1.219W SSS LOCKING",
    "SEALMASTER NO. ER-12C",
    "MOTION INDS NO. 00585202",
    "APPLIED IND NO. 101178321",
    "FLANGE BEARING 2.00B 4BOLT ECCENTRIC COLLAR CAST IRON",
    "TIMKEN/FAFNIR NO. RCJ2",
    "MOTION INDS NO. 00562862",
    "BALL BEARING 90MMB 140MMOD 24MMW C3",
    "SKF NO. 6018 JEM",
  ];
  
  
  
  let productDetails = [
    {
      query: "queryForTesting",
      specsFound: "Yes",
      resultDetail: "resultDetailForTesting"
    }
  ];

const processInput = async (input) => {
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

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

      Step 3 - Return the attributes from Step 2 in two different descriptions. 1. A combined comma-separated description with the format of "Attribute label: attribute value, Attribute label: attribute value". 2. A combined comma-separated description consisting of attribute values only Ex. attribute value, attribute value, attribute value

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
      description:
        "Fetches Google search results for a given query using Google API.",
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
      name: "fetchDataFromRenderedBodyContent",
      description:
        "Fetches the rendered HTML body content from a given URL, then extracts specifications of the product from that HTML body content. Then returns that specification information.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description:
              "The URL to fetch the product specification information from.",
          },
        },
        required: ["url"],
      },
    },
  ];

  const callModel = async (messages) => {
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
      } else if (name === "fetchDataFromRenderedBodyContent") {
        const { url } = JSON.parse(args);
        functionResponse = await fetchDataFromRenderedBodyContent(url);
      }

      const functionContent =
        typeof functionResponse === "object"
          ? JSON.stringify(functionResponse)
          : functionResponse;

      messages.push(response.choices[0].message);
      messages.push({
        role: "function",
        name: name,
        content: functionContent,
      });

      return await callModel(messages);
    }

    return response;
  };

  try {
    const response = await callModel(messages);
    const resultDetail = response.choices[0].message.content;
    const specsFound = await checkIfSpecificationsFound(input, resultDetail, OPENAI_API_KEY);

    productDetails.push({
      query: input,
      specsFound: specsFound,
      resultDetail: resultDetail,
    });
  } catch (error) {
    console.error(`Error processing input "${input}":`, error);
  }
};

const main = async () => {
  for (const input of inputArray) {
    console.log(`Processing: ${input}`);
    await processInput(input);
  }

  // Save results to a file
  fs.writeFileSync("output.json", JSON.stringify(productDetails, null, 2));
  console.log("Processing complete. Results saved to output.json.");
};

main();
