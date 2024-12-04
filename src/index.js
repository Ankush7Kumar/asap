const fetchRenderedBodyContent = require('./fetchRenderedDOM'); // Correct import
const getGoogleResults = require('./apiCalls/google/googleSearch');
const extractSpecifications = require('./apiCalls/openAi/extractSpecifications'); // Module for extracting specifications
const summarizeSpecifications = require('./apiCalls/openAi/summarizeSpecifications'); // Module for summarizing specifications
require('dotenv').config(); // Load environment variables

const API_KEY = process.env.GOOGLE_API_KEY; // Replace with your API key
const CX = process.env.GOOGLE_CSE_ID; // Replace with your Custom Search Engine ID
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // ChatGPT API key





(async () => {
    const query = process.argv[2]; // Get query from command line arguments
    if (!query) {
        console.log('Please provide a search query.');
        return;
    }

    try {
        // Step 1: Fetch top 3 search results (printing 3 for now because 10 or 5 takes up a lot of space on the stdout)
        console.log(`\nSearching Google for: ${query}\n`);
        const urls = await getGoogleResults(query, API_KEY, CX);
        console.log(`urls.len: ${urls.length}`);
        //console.log(`Top ${urls.length} results:\n${urls.join('\n')}\n`);
        console.log(`Top ${urls.length} results:\n${urls.map((url, index) => `${index + 1}. ${url}`).join('\n')}\n`);


        // Initialize a variable to hold the concatenated specifications
        let allSpecifications = "";

        // Step 2: Fetch <body> content for each URL and extract specifications
        for (const [index, url] of urls.entries()) {
            console.log(`Fetching body content for #${index + 1}`);
            try {
                const bodyContent = await fetchRenderedBodyContent(url);
                if (bodyContent) {
                    const specifications = await extractSpecifications(bodyContent, OPENAI_API_KEY);
                    console.log(`Fetching specifications for #${index + 1}\n`);
                    if (specifications) {
                        allSpecifications += `\n===== Product Specifications from ${url} =====\n`;
                        allSpecifications += specifications;
                        allSpecifications += `\n============================================\n`;
                    }
                }
            } catch (error) {
                console.error(`\nIndex.js: Failed to fetch or process for URL: ${url} and Error: ${error.message}\n`);
            }
        }

        // Step 3: Summarize all specifications
        console.log(`\nSummarizing all specifications...\n`);
        const finalSummary = await summarizeSpecifications(allSpecifications, OPENAI_API_KEY);

        // Print the summarized specifications
        console.log('\nFinal Summarized Specifications:\n', finalSummary);
    } catch (error) {
        console.error('\nIndex.js: An error occurred:', error.message);
    }
})();
