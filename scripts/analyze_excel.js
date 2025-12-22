import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper for ESM directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = 'd:\\SMG\\reffernce';

// Get filename from args
const fileName = process.argv[2];

if (!fileName) {
    console.log("Please provide a filename to analyze.");
    process.exit(1);
}

const filePath = path.join(directoryPath, fileName);

try {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    console.log(`Reading file: ${filePath}`);
    // Read file buffer using fs
    const fileBuffer = fs.readFileSync(filePath);
    // Parse buffer with XLSX
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    const output = [];
    // Log all sheet names
    output.push(`Sheets found: ${workbook.SheetNames.join(', ')}`);

    // Analyze the first sheet (usually the main form)
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    output.push(`\n--- Content of Sheet: ${sheetName} ---`);

    // Convert to array of arrays
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

    // Collect strings
    data.forEach((row, index) => {
        if (row.some(cell => cell !== null && cell !== '')) {
            output.push(`Row ${index + 1}: ${JSON.stringify(row)}`);
        }
    });

    const outputPath = path.join(__dirname, '..', 'analysis_log.txt');
    fs.writeFileSync(outputPath, output.join('\n'));
    console.log(`Analysis written to ${outputPath}`);

} catch (error) {
    console.error(`Error processing ${fileName}:`, error.message);
}
