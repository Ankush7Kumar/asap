
/*
// Extracting from specific divs

const { chromium } = require('playwright');

async function fetchGraingerContent(url) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        locale: 'en-US',
    });
    const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

        // Wait for the key elements to load
        await page.waitForSelector('#additionalInfoSection', { timeout: 10000 });
        await page.waitForSelector('#complianceSection', { timeout: 10000 });
        await page.waitForSelector('.productContainer', { timeout: 10000 });
        await page.waitForSelector('.technicalSpecs', { timeout: 10000 });

        const content = await page.evaluate(() => {
            const additionalInfo = document.getElementById('additionalInfoSection');
            const compliance = document.getElementById('complianceSection');
            const productContainer = document.querySelector('.productContainer');
            const technicalSpecs = document.querySelector('.technicalSpecs');

            const additionalInfoContent = additionalInfo ? additionalInfo.innerText.trim() : '';
            const complianceContent = compliance ? compliance.innerText.trim() : '';
            const productContainerContent = productContainer ? productContainer.innerText.trim() : '';
            const technicalSpecsContent = technicalSpecs ? technicalSpecs.innerText.trim() : '';

            return [
                'Additional Info Section:',
                additionalInfoContent,
                'Compliance Section:',
                complianceContent,
                'Product Container:',
                productContainerContent,
                'Technical Specifications:',
                technicalSpecsContent,
            ].join('\n\n');
        });

        return content;
    } catch (error) {
        console.error(`fetchGraingerContent.js: Failed to fetch content for URL ${url}:`, error.message);
        return null; // Fallback value
    } finally {
        await browser.close();
    }
}

module.exports = fetchGraingerContent;

*/

/*

// Extracting the entire body

//Mimicing human behavior 
//Meausres added

const { chromium } = require('playwright');

async function fetchGraingerContent(url) {
    const browser = await chromium.launch({
        headless: true, // Set to false for debugging
    });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        locale: 'en-US',
        extraHTTPHeaders: {
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.grainger.ca', // Mimic navigation from their homepage
            'DNT': '1', // Do Not Track header
            'Upgrade-Insecure-Requests': '1',
            'Accept-Encoding': 'gzip, deflate, br',
        },
    });

    const page = await context.newPage();

    try {
        console.log(`Navigating to Grainger URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

        // Handle potential cookie modals or other popups
        try {
            const cookieButton = await page.$('.accept-cookies-button'); // Update with Grainger's actual selector
            if (cookieButton) {
                console.log('Accepting cookies...');
                await cookieButton.click();
            }
        } catch (modalError) {
            console.warn('No cookie modal detected or failed to interact with it.');
        }

        // Wait for dynamic content to load completely
        await page.waitForTimeout(5000); // Allow time for dynamic content

        // Extract only the meaningful content
        const bodyContent = await page.evaluate(() => {
            const body = document.querySelector('body');
            if (!body) return 'No content found!';
            return body.innerHTML; // Fetch full body content
        });

        console.log(`Successfully fetched Grainger content for URL: ${url}`);
        return bodyContent;
    } catch (error) {
        console.error(`fetchGraingerContent.js: Failed to fetch content for URL ${url}:`, error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

module.exports = fetchGraingerContent;
*/


// Extracting the entire body

//Initial file 


const { chromium } = require('playwright');

async function fetchGraingerContent(url) {

    const browser = await chromium.launch();
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        locale: 'en-US',
        extraHTTPHeaders: {
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.grainger.ca', // Set referer to appear legitimate
        },
    });
    const page = await context.newPage();

    try {
        console.log(`Navigating to Grainger URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

        // Extract only the meaningful content
        const bodyContent = await page.evaluate(() => {
            const body = document.querySelector('body');
            if (!body) return 'No content found!';
            return body.innerHTML; // Alternatively, fine-tune for specific Grainger content
        });

        console.log(`Successfully fetched Grainger content for URL: ${url}`);
        console.log(':) :) grainger bodyy content starts\n')
        console.log(bodyContent)
        console.log(':) :) grainger bodyy content ends\n')
        return bodyContent;
    } catch (error) {
        console.error(`fetchGraingerContent.js: Failed to fetch content for URL ${url}:`, error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

module.exports = fetchGraingerContent;
