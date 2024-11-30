const http = require('http');
const fs = require('fs');
const path = require('path');

// Default server port
let PORT = 8080;

// Function to process JPHL content
function processJPHLContent(content) {
    // Process the <port> tag and set the server port if found
    const portMatch = content.match(/<port>(\d+)<\/port>/);
    if (portMatch) {
        PORT = parseInt(portMatch[1], 10);
        console.log(`Port set to ${PORT}`);
        // Remove the <port> tag from the content before serving
        content = content.replace(/<port>(\d+)<\/port>/, '');
    }

    // Further processing of JPHL-specific logic can be added here
    // For now, we return the cleaned content as is
    return content;
}

// Get the file path from the command-line arguments
const filePath = process.argv[2];

if (!filePath) {
    console.error('Error: Please provide the path to the .jphl file.');
    process.exit(1);
}

// Check if the file exists
fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
        console.error('Error: File not found or not a valid file.');
        process.exit(1);
    }

    // Read the file content
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file.');
            process.exit(1);
        }

        // Process the JPHL content to interpret custom tags
        const processedContent = processJPHLContent(data);

        // Create an HTTP server to serve the content
        const server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(processedContent);
        });

        // Start the server
        server.listen(PORT, () => {
            console.log(`JPHL server is running on http://localhost:${PORT}`);
        });
    });
});
