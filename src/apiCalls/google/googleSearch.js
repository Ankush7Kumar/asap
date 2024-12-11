const axios = require('axios');

/** 
 * Fetches top 3 search results from Google Custom Search Engine API.
 * @param {string} query - Search query string.
 * @param {string} apiKey - Google API Key.
 * @param {string} cx - Custom Search Engine ID.
 * @param {string} cx2 - Custom Search Engine ID 2.
 * @returns {Promise<string[]>} - An array of top 3 URLs.
 */
async function getGoogleResults(query, apiKey, cx, cx2) {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;
    //console.log("getGoogleResults: query is ", query);
    //console.log("getGoogleResults: url is ", url);
    const response = await axios.get(url);
    //console.log("getGoogleResults: response is ",response)
    let items = response.data.items || [];
    
    if (items.length === 0) {
        //console.log("getGoogleResults len0: query is ", query);
        //console.log("getGoogleResults len0: url is ", url);
        const retryUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx2}`;
        const retryResponse = await axios.get(retryUrl);
        let retryItems = retryResponse.data.items || [];
        return retryItems.slice(0, 10).map(item => item.link);
    }

    return items.slice(0, 10).map(item => item.link); // Return top 10 URLs
}


module.exports = getGoogleResults;

 