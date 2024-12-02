const axios = require('axios');
const { apiKey, cseId } = require('./config');

const searchGoogle = async (query) => {
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${cseId}`;
    try {
        const response = await axios.get(url);
        return response.data.items.map(item => ({
            title: item.title,
            link: item.link,
        }));
    } catch (error) {
        console.error('Error fetching search results:', error.message);
        return [];
    }
};

module.exports = { searchGoogle };

