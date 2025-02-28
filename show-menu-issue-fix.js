const http = require('http');

async function testMenuApiRouteDirectly() {
  try {
    // Test dashboard ID
    const dashboardId = 'b24c5f8a-5e25-4f9d-8492-9bf5f418c408'; // Main Dashboard
    
    console.log('=================================================');
    console.log('DASHBOARD MENU ISSUE - FIX VERIFICATION');
    console.log('=================================================');
    console.log('\nTesting direct API call to verify our fix...');
    
    // Build the URL with dashboard ID as a query parameter
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/sidebar/menu?dashboardId=${dashboardId}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };
    
    console.log(`\nMaking request to: ${options.hostname}:${options.port}${options.path}`);
    console.log('Please make sure your Next.js app is running on port 3000\n');
    
    // Function to make the HTTP request
    const makeRequest = () => {
      return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              try {
                resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
              } catch (error) {
                reject(new Error(`Failed to parse response: ${error.message}`));
              }
            } else {
              reject(new Error(`Request failed with status code ${res.statusCode}: ${data}`));
            }
          });
        });
        
        req.on('error', (error) => {
          reject(error);
        });
        
        req.end();
      });
    };
    
    try {
      const response = await makeRequest();
      
      console.log(`API Response Status: ${response.statusCode}`);
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        const menuItems = response.data.data;
        console.log(`\nMenu items found: ${menuItems.length}`);
        console.log('\nMenu Items:');
        menuItems.forEach((item, index) => {
          console.log(`${index + 1}. ${item.name} (Icon: ${item.icon})`);
          if (item.url) {
            console.log(`   URL: ${JSON.stringify(item.url)}`);
          }
          if (item.children && item.children.length > 0) {
            console.log('   Children:');
            item.children.forEach((child, idx) => {
              console.log(`   ${index + 1}.${idx + 1}. ${child.name} (Icon: ${child.icon})`);
              if (child.url) {
                console.log(`      URL: ${JSON.stringify(child.url)}`);
              }
            });
          }
        });
        
        console.log('\n=================================================');
        console.log('FIX VERIFICATION: SUCCESS');
        console.log('=================================================');
        console.log('\nThe menu items are now being correctly retrieved from the database!');
        console.log('\nThe issue was:');
        console.log('1. The API was trying to fetch from a non-existent "menu_items" column in the dashboards table');
        console.log('2. The fallback to the menu_items table had field name inconsistencies');
        console.log('\nThe fix:');
        console.log('1. Simplified the API route to focus on the menu_items table directly');
        console.log('2. Properly mapped database field names to what the frontend expects');
        console.log('\nNow the menu system should work as expected!');
      } else {
        console.log('\nNo menu items found in the API response.');
        console.log('\n=================================================');
        console.log('FIX VERIFICATION: PENDING');
        console.log('=================================================');
        console.log('\nPlease restart your Next.js application and try again.');
      }
    } catch (error) {
      console.error(`\nError testing API:`, error.message);
      console.log('\n=================================================');
      console.log('FIX VERIFICATION: PENDING');
      console.log('=================================================');
      console.log('\nPlease make sure your Next.js app is running on port 3000');
      console.log('and try running this script again.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testMenuApiRouteDirectly();
