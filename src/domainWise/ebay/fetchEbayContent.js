const { chromium } = require('playwright');

async function fetchEbayContent(url) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        locale: 'en-US',
    });
    const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

        // Wait for the key elements to load
        await page.waitForSelector('#mainContent', { timeout: 10000 });
        await page.waitForSelector('.tabs__content', { timeout: 10000 });

        const content = await page.evaluate(() => {
            const idElement = document.getElementById('mainContent');
            const classElements = document.querySelectorAll('.tabs__content');

            const idContent = idElement ? idElement.innerText.trim() : '';
            const classContent = Array.from(classElements).map(el => el.innerText.trim()).join('\n\n');

            return [idContent, classContent].join('\n\n');
        });

        return content;
    } catch (error) {
        console.error(`fetchEbayContent.js: Failed to fetch content for URL ${url}:`, error.message);
        return null; // Fallback value
    } finally {
        await browser.close();
    }
}

module.exports = fetchEbayContent;
