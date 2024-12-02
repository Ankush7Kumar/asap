const axios = require('axios');
const TurndownService = require('turndown');
const { apiKey, cseId } = require('./config');
const cheerio = require('cheerio');

const fetchHTML = async (url) => {
    try {
        // Initial request
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate', // Avoid 'br' encoding to reduce header size
            },
        });

        // Validate response
        if (response.status === 200 && response.headers['content-type']?.includes('text/html')) {
            return response.data; // Return valid HTML
        } else {
            console.error(`Invalid response for ${url}:`, {
                status: response.status,
                contentType: response.headers['content-type'],
            });
            return 'Failed to fetch HTML.';
        }
    } catch (error) {
        if (error.code === 'HPE_HEADER_OVERFLOW') {
            console.error(`Header Overflow Error: Retrying with reduced headers for ${url}`);
            try {
                const reducedResponse = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0',
                        'Accept': '*/*',
                    },
                });
                return reducedResponse.data || 'Failed to fetch HTML.';
            } catch (retryError) {
                console.error(`Retry failed for ${url}:`, retryError.message);
                return 'Failed to fetch HTML.';
            }
        } else if (error.response?.status === 403) {
            console.error(`Access Denied (403): Ensure anti-bot headers for ${url}`);
            return 'Failed to fetch HTML.';
        } else {
            console.error(`Error fetching HTML for ${url}:`, {
                message: error.message,
                code: error.code,
                status: error.response?.status,
            });
            return 'Failed to fetch HTML.';
        }
    }
};

const convertToMarkdown = (html) => {
    if (html === 'Failed to fetch HTML.') return '';
    
    try {
        // Load the HTML into Cheerio
        const $ = cheerio.load(html);

        // Extract the main content (adjust selectors based on target websites)
        const mainContent = $('body').html();

        if (!mainContent) return 'No meaningful content found.';

        // Convert to Markdown using Turndown
        const turndownService = new TurndownService();
        return turndownService.turndown(mainContent);
    } catch (error) {
        console.error('Error during Markdown conversion:', error.message);
        return 'Failed to convert HTML to Markdown.';
    }
};


const searchGoogle = async (query) => {
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${cseId}`;
    try {
        const response = await axios.get(url);
        const results = response.data.items.slice(0, 3).map(async (item) => {
            const html = await fetchHTML(item.link);
            const markdown = convertToMarkdown(html);
            return {
                title: item.title,
                link: item.link,
                html,
                markdown,
            };
        });
        return Promise.all(results); // Resolve all promises
    } catch (error) {
        console.error('Error fetching search results:', error.message);
        return [];
    }
};

module.exports = { searchGoogle };
