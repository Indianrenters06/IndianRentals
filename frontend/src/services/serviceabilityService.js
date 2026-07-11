import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

// Check whether we deliver to a given pincode.
// Returns { serviceable, pincode, state, district, message }.
export const checkServiceability = async (pincode) => {
    const pin = String(pincode || '').trim();
    const response = await axios.get(
        `${API_BASE_URL}/api/settings/serviceability/${encodeURIComponent(pin)}`,
        { validateStatus: (s) => s < 500 }
    );
    return response.data;
};
