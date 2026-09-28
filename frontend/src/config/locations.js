// Branch details: 00_brand/company-facts.md (canonical contacts, June 2026).
// Chennai and Kolkata are service cities, not physical branches.
export const LOCATION_SUPPORT = {
    phone: '+91-9999819719', email: 'support@indianrenters.com',
    hours: 'Mon–Sat, 10:00 AM – 7:30 PM',
};
export const LOCATIONS = {
    delhi: { name: 'Delhi', state: 'Delhi', landmark: 'India Gate',
        address: 'Ground Floor, Unit No. 6, Jumbo Industrial Estate, Dr. Jha Marg, Okhla Phase 3, New Delhi – 110020',
        phone: '011-40735568', pincode: '110020', coordinates: [28.5581435, 77.2632073] },
    mumbai: { name: 'Mumbai', state: 'Maharashtra', landmark: 'Gateway of India',
        address: '117, Sai Dham Building, MIDC Road No. 7, Andheri (East), Mumbai – 400093',
        phone: '022-46043845', pincode: '400093', coordinates: [19.117338, 72.8694771] },
    bangalore: { name: 'Bangalore', state: 'Karnataka', landmark: 'Bangalore',
        address: '1473, First Floor, 17th A Main Road, 2nd Phase JP Nagar, Bangalore – 560078',
        phone: '080-41104733', pincode: '560078', coordinates: [12.9145466, 77.5884224] },
    hyderabad: { name: 'Hyderabad', state: 'Telangana', landmark: 'Charminar',
        address: '11-6-837/C Red Hills, Lakdi Ka Pul, Hyderabad, Telangana – 500004',
        phone: '+91-9212122233', pincode: '500004', coordinates: [17.3993254, 78.4635397] },
    noida: { name: 'Noida', state: 'Uttar Pradesh', landmark: 'Noida',
        address: 'The Iconic Corenthum, Tower C, L8-802, Block A, Noida Sector 62, Uttar Pradesh – 201301',
        phone: LOCATION_SUPPORT.phone, pincode: '201301', coordinates: [28.6275439, 77.3709754] },
    pune: { name: 'Pune', state: 'Maharashtra', landmark: 'Pune',
        address: 'Office No. 3, 1st Floor, Kajale Heights, Paud Phata, Karve Road, Kothrud, Pune – 411038',
        phone: LOCATION_SUPPORT.phone, pincode: '411038', coordinates: [18.5055067, 73.8250036] },
    chennai: { name: 'Chennai', state: 'Tamil Nadu', landmark: 'Chennai', phone: LOCATION_SUPPORT.phone },
    kolkata: { name: 'Kolkata', state: 'West Bengal', landmark: 'Kolkata', phone: LOCATION_SUPPORT.phone },
};
export function locationPhoneHref(phone) {
    return `tel:${phone.startsWith('+') ? phone.replaceAll('-', '') : '+91' + phone.replace(/\D/g, '').replace(/^0/, '')}`;
}
