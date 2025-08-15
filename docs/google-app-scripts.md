# Google Apps Script Setup Guide

This guide will help you set up the Google Apps Script backend for the Hack the Mainframe game leaderboard.

## Step 1: Create Google Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the code provided below
4. Save the project with a name like "Hack Mainframe API"

## Step 2: Google Apps Script Code

Copy and paste this complete code into your Google Apps Script editor:

\`\`\`javascript
// Hack the Mainframe - Google Apps Script API
// This script handles leaderboard data storage and retrieval

// Configuration
const SHEET_NAME = 'Leaderboard';
const MAX_ENTRIES = 1000; // Maximum number of leaderboard entries to keep

/**
 * Main function to handle all API requests
 * @param {Object} e - Event object containing request data
 * @returns {Object} JSON response
 */
function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // Set up CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (e && e.parameter && e.parameter.method === 'OPTIONS') {
      return ContentService
        .createTextOutput('')
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }

    // Parse request data
    let requestData = {};
    
    if (e.postData && e.postData.contents) {
      // POST request
      requestData = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      // GET request
      requestData = e.parameter;
    }

    console.log('Request received:', requestData);

    // Route the request
    let response;
    if (requestData.action === 'submit') {
      response = submitScore(requestData);
    } else {
      // Default to getting leaderboard
      response = getLeaderboard();
    }

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);

  } catch (error) {
    console.error('Error handling request:', error);
    
    const errorResponse = {
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString()
    };

    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Submit a new score to the leaderboard
 * @param {Object} data - Score data {name, time, timestamp}
 * @returns {Object} Response object
 */
function submitScore(data) {
  try {
    // Validate input data
    if (!data.name || !data.time) {
      throw new Error('Missing required fields: name and time');
    }

    const playerName = data.name.toString().trim();
    const completionTime = parseFloat(data.time);
    const timestamp = data.timestamp || new Date().toISOString();

    // Validate data
    if (playerName.length === 0 || playerName.length > 20) {
      throw new Error('Player name must be 1-20 characters');
    }

    if (isNaN(completionTime) || completionTime <= 0 || completionTime > 300) {
      throw new Error('Invalid completion time');
    }

    // Get or create spreadsheet
    const sheet = getOrCreateSheet();
    
    // Add new entry
    const newRow = [
      new Date(timestamp),
      playerName,
      completionTime,
      new Date() // Entry created timestamp
    ];

    sheet.appendRow(newRow);
    console.log('Score submitted:', newRow);

    // Sort and clean up if needed
    sortLeaderboard(sheet);
    cleanupOldEntries(sheet);

    return {
      success: true,
      message: 'Score submitted successfully',
      data: {
        name: playerName,
        time: completionTime,
        timestamp: timestamp
      }
    };

  } catch (error) {
    console.error('Error submitting score:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get the current leaderboard
 * @returns {Object} Response object with leaderboard data
 */
function getLeaderboard() {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();

    // Skip header row if it exists
    const entries = data.length > 1 ? data.slice(1) : [];

    // Convert to leaderboard format
    const leaderboard = entries
      .map((row, index) => ({
        timestamp: row[0],
        name: row[1],
        time: parseFloat(row[2]).toFixed(2),
        rank: index + 1
      }))
      .filter(entry => entry.name && !isNaN(parseFloat(entry.time)))
      .sort((a, b) => parseFloat(a.time) - parseFloat(b.time)) // Sort by time ascending
      .slice(0, 100); // Return top 100 entries

    console.log('Leaderboard retrieved:', leaderboard.length, 'entries');

    return {
      success: true,
      data: leaderboard,
      count: leaderboard.length,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return {
      success: false,
      error: error.toString(),
      data: []
    };
  }
}

/**
 * Get or create the leaderboard spreadsheet
 * @returns {Sheet} Google Sheets object
 */
function getOrCreateSheet() {
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  if (!spreadsheet) {
    // Create new spreadsheet if none exists
    spreadsheet = SpreadsheetApp.create('Hack Mainframe Leaderboard');
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    // Create new sheet
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    
    // Add headers
    const headers = ['Timestamp', 'Player Name', 'Completion Time (s)', 'Entry Created'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#e8f5e8');
    
    console.log('Created new leaderboard sheet');
  }

  return sheet;
}

/**
 * Sort leaderboard by completion time (ascending)
 * @param {Sheet} sheet - Google Sheets object
 */
function sortLeaderboard(sheet) {
  const lastRow = sheet.getLastRow();
  
  if (lastRow > 2) { // More than just headers and one entry
    const dataRange = sheet.getRange(2, 1, lastRow - 1, 4);
    dataRange.sort(3); // Sort by completion time column (ascending)
  }
}

/**
 * Clean up old entries to prevent sheet from getting too large
 * @param {Sheet} sheet - Google Sheets object
 */
function cleanupOldEntries(sheet) {
  const lastRow = sheet.getLastRow();
  
  if (lastRow > MAX_ENTRIES + 1) { // +1 for header row
    const rowsToDelete = lastRow - MAX_ENTRIES - 1;
    sheet.deleteRows(MAX_ENTRIES + 2, rowsToDelete);
    console.log('Cleaned up', rowsToDelete, 'old entries');
  }
}

/**
 * Test function to verify the API is working
 * @returns {Object} Test response
 */
function testAPI() {
  console.log('Testing API...');
  
  // Test submitting a score
  const testSubmit = submitScore({
    name: 'TEST_AGENT',
    time: '15.67',
    timestamp: new Date().toISOString()
  });
  
  console.log('Test submit result:', testSubmit);
  
  // Test getting leaderboard
  const testGet = getLeaderboard();
  console.log('Test get result:', testGet);
  
  return {
    submit: testSubmit,
    get: testGet
  };
}

/**
 * Initialize the spreadsheet (run this once after deployment)
 */
function initializeSpreadsheet() {
  const sheet = getOrCreateSheet();
  console.log('Spreadsheet initialized:', sheet.getName());
  
  // Add some sample data for testing
  const sampleData = [
    [new Date(), 'SAMPLE_AGENT_1', 12.34, new Date()],
    [new Date(), 'SAMPLE_AGENT_2', 15.67, new Date()],
    [new Date(), 'SAMPLE_AGENT_3', 18.90, new Date()]
  ];
  
  sampleData.forEach(row => {
    sheet.appendRow(row);
  });
  
  sortLeaderboard(sheet);
  console.log('Sample data added');
}
\`\`\`

## Step 3: Deploy the Script

1. Click the "Deploy" button in the Google Apps Script editor
2. Choose "New deployment"
3. Set the type to "Web app"
4. Configure the deployment:
   - **Description**: "Hack Mainframe API v1"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone" (this allows the game to access the API)
5. Click "Deploy"
6. **Important**: Copy the "Web app URL" - you'll need this for the next step

## Step 4: Configure the Game

1. Open your game's \`js/config.js\` file
2. Replace \`YOUR_GOOGLE_APPS_SCRIPT_URL_HERE\` with your Web app URL:

\`\`\`javascript
const CONFIG = {
  API_ENDPOINT: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
  // ... rest of config
};
\`\`\`

## Step 5: Test the Integration

1. In Google Apps Script, run the \`initializeSpreadsheet()\` function once to set up the sheet
2. Run the \`testAPI()\` function to verify everything is working
3. Check the "Execution transcript" for any errors
4. Visit your game and try submitting a score
5. Check the admin panel (\`/dev.html\`) to see if the leaderboard loads

## Step 6: Monitor and Maintain

### Viewing Data
- Go to Google Sheets and open the "Hack Mainframe Leaderboard" spreadsheet
- The "Leaderboard" sheet contains all player data
- Data is automatically sorted by completion time (fastest first)

### Troubleshooting
- Check the Google Apps Script "Executions" tab for error logs
- Ensure the Web app is deployed with "Anyone" access
- Verify the API endpoint URL in your game's config
- Test the API functions directly in Google Apps Script

### Security Notes
- The API validates input data to prevent abuse
- Player names are limited to 20 characters
- Completion times must be reasonable (0-300 seconds)
- Old entries are automatically cleaned up to prevent sheet bloat

### Updating the API
- Make changes to the Google Apps Script code
- Click "Deploy" → "Manage deployments"
- Create a new version or update the existing deployment
- The game will automatically use the updated API

## API Endpoints

### Submit Score
- **Method**: POST
- **Data**: \`{action: "submit", name: "PLAYER_NAME", time: "15.67"}\`
- **Response**: \`{success: true, message: "Score submitted successfully"}\`

### Get Leaderboard
- **Method**: GET
- **Response**: \`{success: true, data: [...], count: 50}\`

## Backup and Export

To backup your leaderboard data:
1. Open the Google Sheet
2. File → Download → CSV or Excel format
3. Store the backup file safely

The leaderboard data includes:
- Player timestamps
- Player names
- Completion times
- Entry creation dates