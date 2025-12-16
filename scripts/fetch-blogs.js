import fs from 'fs';

// 1. PASTE YOUR GOOGLE SCRIPT URL HERE
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"; 

async function preFetch() {
  console.log("⏳ Fetching blogs from Google Sheets...");
  
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_blogs`);
    const data = await response.json();
    
    // Ensure the data directory exists
    if (!fs.existsSync('./src/data')) {
      fs.mkdirSync('./src/data');
    }

    // Save to a local file
    fs.writeFileSync('./src/data/cachedBlogs.json', JSON.stringify(data, null, 2));
    console.log(`✅ Success! ${data.length} blogs saved to src/data/cachedBlogs.json`);
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    // If it fails, write an empty array so the app doesn't crash
    fs.writeFileSync('./src/data/cachedBlogs.json', "[]");
  }
}

preFetch();
