const axios = require('axios');

/**
 * Summarizes product specifications from multiple sources using OpenAI's ChatGPT API.
 * @param {string} allSpecifications - Combined product specifications from multiple web pages.
 * @param {string} apiKey - OpenAI API key.
 * @returns {Promise<string>} - Final summarized product specifications.
 */
async function summarizeSpecifications(allSpecifications, apiKey) {
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    const prompt = `
    This is the product specification of a particular product found on multiple web pages. 
    They are all talking about one product. Write down a final summarized product specification. 
    Format the specifications as concise bullet points. If no specifications are found, return an empty string.
    
    Product Specifications:
    ${allSpecifications}
    `;

    try {
        const response = await axios.post(
            endpoint,
            {
                model: 'gpt-4-turbo',
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
        return content || ''; // Return the summarized specifications or an empty string
    } catch (error) {
        console.error('summarizeSpecifications.js: Error calling OpenAI API:', error.message);
        return ''; // Return nothing on failure
    }
}

module.exports = summarizeSpecifications;
