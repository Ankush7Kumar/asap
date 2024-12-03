const axios = require('axios');

/**
 * Extracts product specifications from the HTML body using OpenAI's ChatGPT API.
 * @param {string} bodyContent - HTML body content of the page.
 * @param {string} apiKey - OpenAI API key.
 * @returns {Promise<string>} - Extracted product specifications.
 */
async function extractSpecifications(bodyContent, apiKey) {
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    const prompt = `
    Extract the product specifications of the product described on the web page. The web page has the following HTML content. Format the specifications as concise bullet points. If no specifications are found, return an empty string.
    HTML Content:
    ${bodyContent}
    `;

    try {
        const response = await axios.post(
            endpoint,
            {
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        const content = response.data.choices[0].message.content.trim();
        return content || ''; // Return the specifications or an empty string
    } catch (error) {
        console.error('extractSpecifications.js: Error calling OpenAI API:', error.message);
        return ''; // Return nothing on failure
    }
}

module.exports = extractSpecifications;

