// Import the required file system module
const fs = require('fs');

// Read the JSON file
fs.readFile('output.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Extract query and specsFound attributes
    const extractedData = jsonData.map(record => ({
        query: record.query,
        specsFound: record.specsFound
    }));

    // Log the result
    console.table(extractedData);
});

