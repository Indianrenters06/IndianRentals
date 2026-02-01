const axios = require('axios');

async function testSearch() {
    try {
        const url = 'http://localhost:5000/api/products?keyword=Mac Studio';
        console.log(`Fetching: ${url}`);
        const response = await axios.get(url);
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
        }
    }
}

testSearch();
