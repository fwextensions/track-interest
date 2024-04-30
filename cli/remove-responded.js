const minimist = require("minimist");
const XLSX = require("xlsx");

const args = minimist(process.argv.slice(2), {
	string: ["sent", "noResponse"],
	alias: { sent: "s", noResponse: "n" },
	default: { sent: "Sent.xlsx", noResponse: "NoResponse.xlsx" }
});

const sentPath = args.sent;
const noResponsePath = args.noResponse;

// Load the "Sent" and "NoResponse" spreadsheets
const sentWorkbook = XLSX.readFile(sentPath);
const noResponseWorkbook = XLSX.readFile(noResponsePath);

// Get the first sheet of each workbook
const sentSheet = sentWorkbook.Sheets[sentWorkbook.SheetNames[0]];
const noResponseSheet = noResponseWorkbook.Sheets[noResponseWorkbook.SheetNames[0]];

// Get the data from the sheets as JSON
const sentData = XLSX.utils.sheet_to_json(sentSheet);
const noResponseData = XLSX.utils.sheet_to_json(noResponseSheet);

// Extract all APP_ID values from the "NoResponse" sheet
const noResponseAppIds = new Set(noResponseData.map(row => row.APP_ID));

// Filter the "Sent" data based on the APP_ID column
const filteredSentData = sentData.filter(row => noResponseAppIds.has(row.APP_ID));

// Create a new workbook and sheet to store the filtered data
const newWorkbook = XLSX.utils.book_new();
const newSheet = XLSX.utils.json_to_sheet(filteredSentData);

// Add the new sheet to the workbook
XLSX.utils.book_append_sheet(newWorkbook, newSheet, "FilteredSent");

// Write the new workbook to a file
XLSX.writeFile(newWorkbook, "FilteredSent.xlsx");

console.log(`FilteredSent.xlsx created with filtered data from "${sentPath}"`);
