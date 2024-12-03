const fetchRenderedBodyContent = require('./fetchRenderedDOM'); 
const fetchAndConvertToMarkdown = require('./fetchAndConvertToMarkdown');
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
        console.log("cp1\n");
        console.log("urls.len = ", urls.length);
        // Step 2: Fetch mardown of <body> content for each URL
        for (const [index, url] of urls.entries()) {
            console.log("cp2\n");
            console.log(`\n\nFetching rendered body content for URL #${index + 1}: ${url}\n`);
            try {
                const markDownBodyContent = await fetchAndConvertToMarkdown(url);
                console.log(`\n===== Markdown Body Content for URL #${index + 1}: ${url} ==STARTING==========================\n`);
                console.log(markDownBodyContent);
                console.log(`\n===== Markdown Body Content for URL #${index + 1}: ${url} ==ENDING============================\n\n\n`);
            } catch (error) {
                console.error(`\nIndex.js: Failed to fetchAndConvertToMarkdown for URL #${index + 1}: ${url} and Error: ${error.message}\n`);
            }
        }
        
    } catch (error) {
        console.error('\nIndex.js: An error occurred:', error.message);
    }
})();
