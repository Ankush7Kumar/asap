const { chromium } = require('playwright');
const fetchAmazonContent = require('./domainWise/amazon/fetchAmazonContent');
const fetchEbayContent = require('./domainWise/ebay/fetchEbayContent');
const fetchGraingerContent = require('./domainWise/grainger/fetchGraingerContent');

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
            return null; // Fallback value
        }
    } finally {
        await browser.close();
    }
}

module.exports = fetchRenderedBodyContent;
