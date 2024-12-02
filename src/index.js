const { searchGoogle } = require('./search');

(async () => {
    const query = process.argv[2] || 'example query'; // Take query from command line
    console.log(`Searching for: ${query}`);
    const results = await searchGoogle(query);

    if (results.length === 0) {
        console.log('No results found.');
    } else {
        console.log('Search Results:');
        results.forEach((result, index) => {
            console.log(`\nResult ${index + 1}:`);
            console.log(`Link: ${result.link}`);
            console.log(`HTML: ${result.html.substring(0, 500)}...`); // Print only first 500 characters of HTML for brevity
        });
    }
})();
