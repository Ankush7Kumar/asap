const TurndownService = require('turndown');
const fetchRenderedBodyContent = require('./fetchRenderedDOM'); // Import the fetch function

async function fetchAndConvertToMarkdown(url) {
    try {
        // Fetch the rendered HTML body content
        const htmlContent = await fetchRenderedBodyContent(url);
        // Convert the HTML content to Markdown
        const markdownContent = convertHtmlToMarkdown(htmlContent);
        return markdownContent;

    } catch (error) {
        console.error('fetchAndConvertToMarkdown.js: Error during fetch or conversion:', error);
        throw error;
    } 
}

async function convertHtmlToMarkdown(htmlContent) {
    const turndownService = new TurndownService();
    // Convert the HTML content to Markdown
    const markdownContent = turndownService.turndown(htmlContent);
    return markdownContent;
}

module.exports = fetchAndConvertToMarkdown; // Export the combined function
