const axios = require('axios');
//const fetch = require("node-fetch");
const cheerio = require("cheerio");


/** 
 * Fetches top 3 search results from Google Custom Search Engine API.
 * @param {string} query - Search query string.
 * @param {string} apiKey - Google API Key.
 * @param {string} cx - Custom Search Engine ID.
 //* @param {string} cx2 - Custom Search Engine ID 2.
 * @returns {Promise<string[]>} - An array of top 3 URLs.
 */

async function googleSearch(query) {
    // Format the query for the Google search URL
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.google.com/search?q=${encodedQuery}`;

    // Set up headers to mimic a browser visit
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
    };

    try {
        // Perform the GET request
        const response = await axios.get(url, { headers });

        // Load the HTML into Cheerio
        const $ = cheerio.load(response.data);

        // Extract links from the search results
        let items = [];
        $("div.tF2Cxc").each((index, element) => {
            const link = $(element).find("a").attr("href");
            if (link) items.push(link);
        });

        // Return the first 10 links
        return items.slice(0, 10);
    } catch (error) {
        console.error("Error during the search:", error.message);
        return [];
    }
}


async function getGoogleResults(query, apiKey, cx) {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;
    //console.log("getGoogleResults: query is ", query);
    //console.log("getGoogleResults: url is ", url);
    const response = await axios.get(url);
    //console.log("getGoogleResults: response is ",response)
    let items = response.data.items || [];
    
    if (items.length === 0) {
        console.log(" :) :) inside inner loop :) :)")
        /*
        const url2 = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx2}`;
        const response2 = await axios.get(url2);
        let items2 = response2.data.items || [];
        return items2.slice(0, 10).map(item => item.link);
        */
        const links = await googleSearch(query);
        return links;
    }

    return items.slice(0, 10).map(item => item.link); // Return top 10 URLs
}


module.exports = getGoogleResults;

