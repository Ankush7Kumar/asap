const axios = require('axios');

/**
 * Fetches top 3 search results from Google Custom Search Engine API.
 * @param {string} query - Search query string.
 * @param {string} apiKey - Google API Key.
 * @param {string} cx - Custom Search Engine ID.
 * @returns {Promise<string[]>} - An array of top 3 URLs.
 */
async function getGoogleResults(query, apiKey, cx) {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;
    const response = await axios.get(url);
    const items = response.data.items || [];
    return items.slice(0, 10).map(item => item.link); // Return top 3 URLs
}

module.exports = getGoogleResults;

 