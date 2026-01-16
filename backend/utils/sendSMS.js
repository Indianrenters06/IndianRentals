const axios = require('axios');

const sendSMS = async (options) => {
    // options: { phone, message }
    // phone should be a string of numbers. Fast2SMS expects numbers like "9999999999"
    // Remove +91 if present? 
    // Fast2SMS documentation says: "Mobile Number (Multiple mobile numbers separated by comma)"
    // It usually accepts 10 digit numbers.

    let numbers = options.phone;
    if (numbers.startsWith('+91')) {
        numbers = numbers.slice(3);
    }

    // Clean up any non-digit chars
    numbers = numbers.replace(/\D/g, '');

    // Remove 91 prefix if present (assuming Indian numbers)
    if (numbers.length === 12 && numbers.startsWith('91')) {
        numbers = numbers.slice(2);
    }

    // console.log('Using API Key:', process.env.FAST2SMS_API_KEY); 

    try {
        const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
            params: {
                authorization: process.env.FAST2SMS_API_KEY ? process.env.FAST2SMS_API_KEY.trim() : '',
                route: 'q',
                message: options.message,
                language: 'english',
                flash: 0,
                numbers: numbers,
            },
        });

        console.log('Fast2SMS Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Fast2SMS Error:', error.response?.data || error.message);
        // Don't throw if you want to fail gracefully in the controller
        // but typically we might want to know if it failed.
        throw new Error('SMS could not be sent');
    }
};

module.exports = sendSMS;
