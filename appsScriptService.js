// appsScriptService.js
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwbvCAOUg_uPwIuBXfk441XFG83pbeLaSJaBYZXbv4KnGoTyz1TjeSvnV5uyQ74ubB5Mg/exec';

// Initialize sheet with headers if needed
export const initializeSheet = async () => {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    console.log('Initialization response:', text);
    return true;
  } catch (error) {
    console.error('Error initializing sheet:', error);
    return false;
  }
};

// Function to append data to Google Sheet
export const appendToSheet = async (barcode) => {
  try {
    // 1. Validate barcode format
    if (!barcode || typeof barcode !== 'string') {
      console.log('Invalid barcode format:', barcode);
      return {
        success: false,
        message: 'Invalid barcode format'
      };
    }

    // 2. Prepare request data
    const requestData = {
      barcode: barcode
    };

    console.log('Sending request with data:', requestData);

    // 3. Make POST request to Google Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('Response status:', response.status);
    
    // 4. Parse response
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      return {
        success: false,
        message: 'Invalid response from server'
      };
    }
    
    // 5. Return appropriate response
    if (data.success) {
      return {
        success: true,
        message: data.message
      };
    } else {
      console.log('Server returned error:', data);
      return {
        success: false,
        duplicate: data.duplicate || false,
        message: data.message || 'Failed to save barcode'
      };
    }
  } catch (error) {
    console.error('Error in appendToSheet:', error);
    return {
      success: false,
      message: 'Failed to connect to Google Sheets: ' + error.message
    };
  }
};

export const removeDuplicates = async () => {
  try {
    const response = await fetch(APPS_SCRIPT_URL + '?action=removeDuplicates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return {
      success: data.success,
      message: data.message
    };
  } catch (error) {
    console.error('Error removing duplicates:', error);
    return {
      success: false,
      message: 'Failed to connect to Google Sheets'
    };
  }
}; 