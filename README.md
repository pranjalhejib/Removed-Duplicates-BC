# Inventory Tracker

A React Native mobile application for tracking inventory using barcode scanning and Google Sheets integration.

## Features

- 📱 Mobile-friendly interface
- 📸 Barcode scanning with multiple format support (QR, EAN13, EAN8, UPC, Code39, Code128, etc.)
- 📊 Real-time data storage in Google Sheets
- 🔄 Duplicate entry prevention
- 🗑️ Duplicate removal functionality
- 🔄 Automatic timestamp recording
- 📱 Camera flip functionality

## Project Structure

```
InventoryTracker/
├── App.js                 # Main application component
├── HomeScreen.js          # Home screen component
├── QRScanner.js           # Barcode scanning component
├── appsScriptService.js   # Google Apps Script integration
├── Code.gs                # Google Apps Script code
├── assets/                # Static assets
├── .expo/                 # Expo configuration
└── node_modules/          # Dependencies
```

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Google account for Google Sheets integration
- Mobile device with camera or emulator

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd InventoryTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Google Apps Script Setup**
   - Open Google Apps Script (https://script.google.com)
   - Create a new project
   - Copy the contents of `Code.gs` into the editor
   - Deploy as a web app with the following settings:
     - Execute as: "Me"
     - Who has access: "Anyone"
   - Copy the deployment URL and update it in `appsScriptService.js`

4. **Google Sheets Setup**
   - Create a new Google Sheet
   - Share it with the email address associated with your Google Apps Script
   - The script will automatically create the necessary columns

5. **Run the application**
   ```bash
   npm start
   # or
   yarn start
   ```

## Usage

1. **Scanning Barcodes**
   - Open the app
   - Point the camera at a barcode
   - The app will automatically scan and process the barcode
   - You'll receive immediate feedback if the barcode is a duplicate

2. **Viewing Inventory**
   - Navigate to the home screen
   - View your inventory data in real-time

3. **Managing Duplicates**
   - The app automatically prevents duplicate entries
   - Use the remove duplicates function to clean up existing duplicates

## Technical Details

### Barcode Support
The app supports the following barcode formats:
- QR codes
- EAN13
- EAN8
- UPC-A
- UPC-E
- Code39
- Code128
- DataMatrix
- PDF417

### Data Storage
- Data is stored in Google Sheets
- Each entry includes:
  - Barcode number
  - Timestamp
  - Status (new/duplicate)

### Error Handling
- Duplicate entry detection
- Network error handling
- Invalid barcode format detection
- Google Sheets connection issues

## Troubleshooting

1. **Barcode not scanning**
   - Ensure good lighting
   - Hold the camera steady
   - Check if the barcode format is supported

2. **Data not saving**
   - Check internet connection
   - Verify Google Apps Script deployment
   - Ensure proper permissions in Google Sheets

3. **App crashes**
   - Clear app cache
   - Restart the application
   - Check for updates

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers. 