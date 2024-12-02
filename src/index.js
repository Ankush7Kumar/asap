const fetchRenderedBodyContent = require('./fetchRenderedDOM'); // Correct import
const getGoogleResults = require('./googleSearch');
require('dotenv').config(); // Load environment variables


const API_KEY = process.env.GOOGLE_API_KEY; // Replace with your API key
const CX = process.env.GOOGLE_CSE_ID; // Replace with your Custom Search Engine ID

(async () => {
    const query = process.argv[2]; // Get query from command line arguments
    if (!query) {
        console.log('Please provide a search query.');
        return;
    }

    try {
        // Step 1: Fetch top 3 search results
        console.log(`\nSearching Google for: ${query}\n`);
        const urls = await getGoogleResults(query, API_KEY, CX);
        console.log(`Top 3 results:\n${urls.join('\n')}\n`);

        // Step 2: Fetch <body> content for each URL
        for (const url of urls) {
            console.log(`Fetching rendered body content for: ${url}`);
            try {
                const bodyContent = await fetchRenderedBodyContent(url);
                console.log(`\n===== Body Content for ${url} =====`);
                console.log(bodyContent); // Log first 500 characters for brevity
                console.log(`\n=================================\n`);
            } catch (error) {
                console.error(`Failed to fetch ${url}:`, error.message);
            }
        }
    } catch (error) {
        console.error('\nAn error occurred:', error.message);
    }
})();
