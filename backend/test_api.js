const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:5000';

const runTests = async () => {
    try {
        console.log('--- STARTING API TESTS ---');

        // 1. Health Check
        try {
            const res = await axios.get(`${BASE_URL}/`);
            console.log('✅ Health Check Passed:', res.data);
        } catch (error) {
            console.error('❌ Health Check Failed:', error.message);
        }

        // 2. Register / Login User
        let token;
        const testUser = {
            name: 'Test API User',
            email: `test_api_${Date.now()}@example.com`,
            password: 'Password123!',
            phone: '9876543210'
        };

        try {
            console.log(`\nAttempting to register user: ${testUser.email}`);
            const regRes = await axios.post(`${API_URL}/auth/register`, testUser);
            console.log('✅ Registration Successful:', regRes.data.email);
            token = regRes.data.token;
        } catch (error) {
            console.error('❌ Registration Failed:', error.response ? error.response.data.message : error.message);
            // Try login if user exists (fallback for repeated runs if email wasn't unique enough)
        }

        if (!token) {
            return;
        }

        // 3. Get User Profile (Protected Route)
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const profileRes = await axios.get(`${API_URL}/users/profile`, config);
            console.log('✅ Get Profile Passed:', profileRes.data.email);
            console.log('   KYC Field Check:', profileRes.data.kyc ? 'Present' : 'Missing');
        } catch (error) {
            console.error('❌ Get Profile Failed:', error.response ? error.response.data.message : error.message);
        }

        // 4. Test Product Search (New Logic)
        try {
            // Test with a generic search
            const searchRes = await axios.get(`${API_URL}/products?keyword=laptop`);
            console.log(`\n✅ Product Search (keyword='laptop'): Found ${searchRes.data.products.length} products`);

            // Test with price filter (assuming database might be empty or have sample data, this might verify query structure doesn't crash)
            const priceRes = await axios.get(`${API_URL}/products?minPrice=100&maxPrice=500000`);
            console.log(`✅ Product Filter (Price 100-500000): Found ${priceRes.data.products.length} products`);

        } catch (error) {
            console.error('❌ Product Search Failed:', error.response ? error.response.data.message : error.message);
        }

        console.log('\n--- TESTS COMPLETED ---');

    } catch (err) {
        console.error('Fatal Error:', err);
    }
};

runTests();
