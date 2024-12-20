const { chromium } = require('playwright');
const fetchAmazonContent = require('./domainWise/amazon/fetchAmazonContent');
const fetchEbayContent = require('./domainWise/ebay/fetchEbayContent');
const fetchGraingerContent = require('./domainWise/grainger/fetchGraingerContent');
const extractSpecifications = require('./apiCalls/openAi/extractSpecifications');

require("dotenv").config({ path: "./.env" });
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // OpenAI API Key


async function fetchRenderedBodyContent(url) {

    if (url.startsWith('https://www.amazon.com')) {
        return await fetchAmazonContent(url);
    }

    if (url.startsWith('https://www.ebay.com')) {
        return await fetchEbayContent(url); 
    }

    if (url.startsWith('https://www.grainger.ca')) {
        return await fetchGraingerContent(url);
    }

    const browser = await chromium.launch();
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        locale: 'en-US',
    });
    const page = await context.newPage();

    try {
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
            const bodyContent = await page.evaluate(() => document.body.innerHTML);
            return bodyContent;
        } catch (error) {
            console.error(`fetchRenderedDOM.js: Failed to fetch the rendered body for URL ${url}:`, error.message);
            return "no body content found"; // Fallback value
        }
    } finally {
        await browser.close();
    } 
}

 
async function fetchDataFromRenderedBodyContent(url) {
    try {
        // Fetch the rendered body content
        const bodyContent = await fetchRenderedBodyContent(url);
        
        if (!bodyContent) {
            throw new Error("fetchDataFromRenderedBodyContent: Failed to fetch rendered body content");
        }

        // Fetch data from the rendered body content
        const data = await extractSpecifications(bodyContent, OPENAI_API_KEY);
        
        if (!data) {
            throw new Error("fetchDataFromRenderedBodyContent: Failed to extract specifications from the body content");
        }

        return data;
    } catch (error) {
        return "No data found"
        console.error(`fetchDataFromRenderedBodyContent: ${error.message}`);
        // You can rethrow the error or return a default value as needed
        throw error; // or return null;
    }
}


module.exports = fetchRenderedBodyContent;
module.exports = fetchDataFromRenderedBodyContent;

