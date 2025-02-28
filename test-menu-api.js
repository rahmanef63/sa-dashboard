const http = require('http');

async function testMenuApi() {
  try {
    // Dashboard IDs from our previous test
    const dashboardIds = [
      'b24c5f8a-5e25-4f9d-8492-9bf5f418c408', // Main Dashboard
      'f5531af3-4bbe-4906-bc37-4b9d8f509ece'  // Test Dashboard
    ];
    
    console.log('Testing Menu API for both dashboards...\n');
    
    for (const dashboardId of dashboardIds) {
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
                  const responseData = JSON.parse(data);
                  resolve({ statusCode: res.statusCode, data: responseData });
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
        console.log(`Testing dashboard ID: ${dashboardId}`);
        const response = await makeRequest();
        
        console.log(`Status code: ${response.statusCode}`);
        if (response.data && response.data.items) {
          console.log(`Menu items found: ${response.data.items.length}`);
          console.log('Items:');
          response.data.items.forEach(item => {
            console.log(`- ${item.name} [Icon: ${item.icon}]`);
            if (item.children && item.children.length > 0) {
              item.children.forEach(child => {
                console.log(`  └─ ${child.name} [Icon: ${child.icon}]`);
              });
            }
          });
        } else {
          console.log('No menu items found in response or invalid response format');
        }
      } catch (error) {
        console.error(`Error testing dashboard ID ${dashboardId}:`, error.message);
        console.error('Make sure your Next.js app is running on port 3000');
      }
      
      console.log('\n---\n');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testMenuApi();
