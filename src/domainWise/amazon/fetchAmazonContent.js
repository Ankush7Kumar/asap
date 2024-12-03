const { chromium } = require('playwright');

async function fetchAmazonContent(url) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        locale: 'en-US',
    });
    const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 });

        const ids = [
            'title_feature_div',
            'corePriceDisplay_desktop_feature_div',
            'productOverview_feature_div',
            'detailBullets_feature_div',
            'productDescription_feature_div'
        ];

        let content = '';
        for (const id of ids) {
            try {
                // Wait for the current div to render
                await page.waitForSelector(`#${id}`, { timeout: 5000 });
                // Scrape its content
                const divContent = await page.evaluate((divId) => {
                    const element = document.getElementById(divId);
                    return element ? element.innerText.trim() : '';
                }, id);

                // Append to the final content string
                content += divContent + '\n\n';
            } catch (error) {
                console.warn(`Div with ID '${id}' not found or failed to load:`, error.message);
                // Continue to the next div if this one fails
            }
        }

        return content.trim();
    } catch (error) {
        console.error(`fetchAmazonContent.js: Failed to fetch content for URL ${url}:`, error.message);
        return null; // Fallback value
    } finally {
        await browser.close();
    }
}

module.exports = fetchAmazonContent;

/*
const { chromium } = require('playwright');

async function fetchAmazonContent(url) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        locale: 'en-US',
    });
    const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 180000 });

        // Wait for a key element to load (e.g., 'title_feature_div')
        await page.waitForSelector('#title_feature_div', { timeout: 60000 });

        const content = await page.evaluate(() => {
            const ids = [
                'title_feature_div',
                'corePriceDisplay_desktop_feature_div',
                'productOverview_feature_div',
                'detailBullets_feature_div',
                'productDescription_feature_div'
            ];
            return ids.map(id => {
                const element = document.getElementById(id);
                return element ? element.innerText.trim() : '';
            }).join('\n\n');
        });

        return content;
    } catch (error) {
        console.error(`fetchAmazonContent.js: Failed to fetch content for URL ${url}:`, error.message);
        return null; // Fallback value
    } finally {
        await browser.close();
    }
}

module.exports = fetchAmazonContent;
*/