const formatResults = (results) =>
  results.map((result, index) => `${index + 1}. ${result.title} - ${result.link}`).join('\n');

  results.map(result => result.link).join('\n'); 
module.exports = { formatResults };
