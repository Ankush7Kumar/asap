const { chromium } = require('playwright');

async function fetchRenderedBodyContent(url) {
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
