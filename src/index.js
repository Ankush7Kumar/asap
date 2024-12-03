const fetchRenderedBodyContent = require('./fetchRenderedDOM'); // Correct import
const getGoogleResults = require('./googleSearch');
const extractSpecifications = require('./extractSpecifications'); // New module
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
        console.log(`Top 3 results:\n${urls.join('\n')}\n`);

        // Step 2: Fetch <body> content for each URL and extract specifications
        for (const url of urls) {
            console.log(`Fetching rendered body content for: ${url}`);
            try {
                const bodyContent = await fetchRenderedBodyContent(url);
                if (bodyContent) {
                    const specifications = await extractSpecifications(bodyContent, OPENAI_API_KEY);
                    if (specifications) {
                        console.log(`\n===== Product Specifications for ${url} =====`);
                        console.log(specifications);
                        console.log(`\n============================================\n`);
                    }
                }
            } catch (error) {
                console.error(`Failed to fetch or process ${url}`);
            }
        }
    } catch (error) {
        console.error('\nAn error occurred:', error.message);
    }
})();
