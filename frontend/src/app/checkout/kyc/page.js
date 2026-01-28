'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaFingerprint } from 'react-icons/fa';
import { PiCheckCircleFill, PiCheckCircle } from 'react-icons/pi';
import OrderSummary from '../../../components/OrderSummary';

const STATE_CITY_MAP = {
    "Andhra Pradesh": [
        "Adoni", "Amalapuram", "Anakapalle", "Anantapur", "Bapatla", "Bhimavaram", "Chirala", "Chittoor",
        "Dharmavaram", "Eluru", "Gudivada", "Gudur", "Guntakal", "Guntur", "Hindupur", "Kadapa", "Kakinada",
        "Kavali", "Kurnool", "Machilipatnam", "Madanapalle", "Nandyal", "Narasaraopet", "Nellore", "Ongole",
        "Proddatur", "Rajahmundry", "Srikakulam", "Tadepalligudem", "Tadpatri", "Tenali", "Tirupati", "Vijayawada",
        "Visakhapatnam", "Vizianagaram"
    ],
    "Arunachal Pradesh": [
        "Aalo", "Anini", "Basar", "Bomdila", "Changlang", "Daporijo", "Hawai", "Itanagar", "Jairampur",
        "Khonsa", "Koloriang", "Longding", "Miao", "Naharlagun", "Namsai", "Pasighat", "Roing", "Seppa",
        "Tawang", "Tezu", "Yingkiong", "Ziro"
    ],
    "Assam": [
        "Barpeta", "Bongaigaon", "Dhemaji", "Dhubri", "Dibrugarh", "Diphu", "Goalpara", "Golaghat", "Guwahati",
        "Haflong", "Hailakandi", "Hojai", "Jorhat", "Karimganj", "Kokrajhar", "Lanka", "Lumding", "Mangaldoi",
        "Mankachar", "Margherita", "Mariani", "Nagaon", "Nalbari", "North Lakhimpur", "Rangia", "Sibsagar",
        "Silapathar", "Silchar", "Tezpur", "Tinsukia", "Udalguri"
    ],
    "Bihar": [
        "Araria", "Arrah", "Aurangabad", "Bagaha", "Begusarai", "Bettiah", "Bhabua", "Bhagalpur", "Bihar Sharif",
        "Buxar", "Chhapra", "Darbhanga", "Dehri", "Gaya", "Gopalganj", "Hajipur", "Jamalpur", "Jamui",
        "Jehanabad", "Katihar", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Motihari", "Munger",
        "Muzaffarpur", "Nawada", "Patna", "Purnia", "Saharsa", "Samastipur", "Sasaram", "Sheikhpura",
        "Sitamarhi", "Siwan", "Supaul"
    ],
    "Chhattisgarh": [
        "Ambikapur", "Bhatapara", "Bhilai", "Bilaspur", "Chirmiri", "Dalli-Rajhara", "Dhamtari", "Durg",
        "Jagdalpur", "Kanker", "Kawardha", "Korba", "Mahasamund", "Manendragarh", "Mungeli", "Naila Janjgir",
        "Raigarh", "Raipur", "Rajnandgaon", "Sakti", "Tilda Newra"
    ],
    "Goa": [
        "Bicholim", "Canacona", "Curchorem", "Cuncolim", "Mapusa", "Margao", "Mormugao", "Panaji", "Pernem",
        "Ponda", "Quepem", "Sanguem", "Sanquelim", "Valpoi", "Vasco da Gama"
    ],
    "Gujarat": [
        "Ahmedabad", "Amreli", "Anand", "Anjar", "Ankleshwar", "Bardoli", "Bharuch", "Bhavnagar", "Bhuj",
        "Botad", "Dahod", "Deesa", "Dhoraji", "Gandhidham", "Gandhinagar", "Godhra", "Gondal", "Himmatnagar",
        "Jamnagar", "Jetpur", "Junagadh", "Kalol", "Keshod", "Khambhat", "Mahesana", "Modasa", "Morbi",
        "Nadiad", "Navsari", "Palanpur", "Patan", "Porbandar", "Rajkot", "Savarkundla", "Sidhpur", "Surat",
        "Surendranagar", "Una", "Unjha", "Upleta", "Vadodara", "Valsad", "Vapi", "Veraval", "Visnagar", "Wankaner"
    ],
    "Haryana": [
        "Ambala", "Ambala Cantt", "Bahadurgarh", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gohana",
        "Gurgaon", "Hansi", "Hisar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mandi Dabwali", "Narnaul",
        "Narwana", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Thanesar",
        "Tohana", "Yamunanagar"
    ],
    "Himachal Pradesh": [
        "Baddi", "Bilaspur", "Chamba", "Dalhousie", "Dharamshala", "Hamirpur", "Kangra", "Kullu", "Mandi",
        "Manali", "Nahan", "Nalagarh", "Palampur", "Paonta Sahib", "Parwanoo", "Shimla", "Solan", "Sundarnagar", "Una"
    ],
    "Jharkhand": [
        "Adityapur", "Bokaro", "Chaibasa", "Chakradharpur", "Chatra", "Daltonganj", "Deoghar", "Dhanbad",
        "Dumka", "Giridih", "Gumia", "Hazaribagh", "Jamshedpur", "Jhumri Tilaiya", "Lohardaga", "Madhupur",
        "Medininagar", "Pakur", "Phusro", "Ramgarh", "Ranchi", "Sahibganj", "Saunda", "Simdega"
    ],
    "Karnataka": [
        "Bagalkot", "Bangalore", "Belgaum", "Bellary", "Bhadravati", "Bidar", "Bijapur", "Chikmagalur",
        "Chikutir", "Chintamani", "Chitradurga", "Davangere", "Dharwad", "Gadag-Betigeri", "Gangawati",
        "Gokak", "Gulbarga", "Hassan", "Haveri", "Hospet", "Hubli", "Karwar", "Kolar", "Koppal", "Mandya",
        "Mangalore", "Mysore", "Nipani", "Raichur", "Ramanagaram", "Ranibennur", "Robertson Pet", "Sagar",
        "Shimoga", "Sirsi", "Tumkur", "Udupi", "Yadgir"
    ],
    "Kerala": [
        "Adoor", "Alappuzha", "Aluva", "Angamaly", "Attingal", "Chalakudy", "Changanassery", "Chengannur",
        "Cherthala", "Chittur-Thathamangalam", "Guruvayoor", "Irinjalakuda", "Kalamassery", "Kanhangad",
        "Kannur", "Kasaragod", "Kayamkulam", "Kochi", "Kodungallur", "Kollam", "Kottayam", "Koyilandy",
        "Kozhikode", "Kunnamkulam", "Malappuram", "Manjeri", "Mattannur", "Mavelikkara", "Muvattupuzha",
        "Nedumangad", "Neyyattinkara", "Nilambur", "Ottappalam", "Palai", "Palakkad", "Ponnani", "Punalur",
        "Shoranur", "Taliparamba", "Thiruvalla", "Thiruvananthapuram", "Thodupuzha", "Thrissur", "Tirur",
        "Varkala", "Vadakara"
    ],
    "Madhya Pradesh": [
        "Ashoknagar", "Balaghat", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara",
        "Damoh", "Datia", "Dewas", "Dhar", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Itarsi",
        "Jabalpur", "Khandwa", "Khargone", "Mandsaur", "Morena", "Murwara", "Nagda", "Neemuch", "Pithampur",
        "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri",
        "Singrauli", "Tikamgarh", "Ujjain", "Vidisha"
    ],
    "Maharashtra": [
        "Achalpur", "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Baramati", "Beed", "Bhandara",
        "Bhiwandi", "Bhusawal", "Bid", "Buldana", "Chandrapur", "Dhule", "Gondia", "Hinganghat", "Ichalkaranji",
        "Jalgaon", "Jalna", "Kalyan-Dombivli", "Karad", "Kolhapur", "Latur", "Malegaon", "Mira-Bhayandar",
        "Mumbai", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Navi Mumbai", "Osmanabad", "Palghar", "Panvel",
        "Parbhani", "Phaltan", "Pimpri-Chinchwad", "Pune", "Ratnagiri", "Sangli", "Satara", "Solapur", "Thane",
        "Udgir", "Ulhasnagar", "Vasai-Virar", "Wardha", "Yavatmal"
    ],
    "Manipur": [
        "Bishnupur", "Churachandpur", "Imphal", "Jiribam", "Kakching", "Lilong", "Mayang Imphal", "Nambol",
        "Thoubal", "Ukhrul", "Wangjing", "Yairipok"
    ],
    "Meghalaya": [
        "Baghmara", "Jowai", "Nongpoh", "Nongstoin", "Resubelpara", "Shillong", "Tura", "Williamnagar"
    ],
    "Mizoram": [
        "Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"
    ],
    "Nagaland": [
        "Chumukedima", "Dimapur", "Kohima", "Mokokchung", "Mon", "Phek", "Tuensang", "Wokha", "Zunheboto"
    ],
    "Odisha": [
        "Angul", "Balangir", "Balasore", "Bargarh", "Baripada", "Berhampur", "Bhadrak", "Bhawanipatna",
        "Bhubaneswar", "Brahmapur", "Brajarajnagar", "Byasanagar", "Cuttack", "Dhenkanal", "Jeypore",
        "Jharsuguda", "Kendujhar", "Paradip", "Puri", "Rayagada", "Rourkela", "Sambalpur", "Sunabeda"
    ],
    "Punjab": [
        "Abohar", "Amritsar", "Barnala", "Batala", "Bathinda", "Dhuri", "Faridkot", "Fazilka", "Firozpur",
        "Firozpur Cantt", "Gurdaspur", "Hoshiarpur", "Jagraon", "Jalandhar", "Kapurthala", "Khanna",
        "Kot Kapura", "Ludhiana", "Malerkotla", "Malout", "Mansa", "Moga", "Mohali", "Muktsar", "Nabha",
        "Pathankot", "Patiala", "Phagwara", "Rajpura", "Rupnagar", "Sangrur", "Sunam", "Tarn Taran"
    ],
    "Rajasthan": [
        "Ajmer", "Alwar", "Amarsar", "Balotra", "Banswara", "Baran", "Barmer", "Beawar", "Bharatpur", "Bhilwara",
        "Bhiwadi", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh",
        "Hindaun", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kishangarh",
        "Kota", "Kuchaman City", "Ladnun", "Madanganj", "Makrana", "Nagaur", "Nawalgarh", "Nimbahera", "Nohar",
        "Pali", "Phalodi", "Pilani", "Pratapgarh", "Pushkar", "Rajsamand", "Ratangarh", "Sardarshahar", "Sawai Madhopur",
        "Sikar", "Sirohi", "Sri Ganganagar", "Sujangarh", "Suratgarh", "Tonk", "Udaipur"
    ],
    "Sikkim": [
        "Gangtok", "Geyzing", "Jorethang", "Mangan", "Namchi", "Nayabazar", "Rangpo", "Singtam"
    ],
    "Tamil Nadu": [
        "Alandur", "Ambur", "Arakkonam", "Arcot", "Avadi", "Chennai", "Chidambaram", "Coimbatore", "Cuddalore",
        "Dharmapuri", "Dindigul", "Erode", "Gobichettipalayam", "Gudiyatham", "Hosur", "Kancheepuram",
        "Karaikudi", "Karur", "Kumbakonam", "Madurai", "Nagapattinam", "Nagercoil", "Namakkal", "Neyveli",
        "Ooty", "Pallavaram", "Panihati", "Paramakudi", "Pollachi", "Pudukkottai", "Rajapalayam",
        "Ramanathapuram", "Salem", "Sivakasi", "Tambaram", "Thanjavur", "Theni Allinagaram", "Thoothukudi",
        "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvannamalai", "Vellore", "Viluppuram", "Virudhunagar"
    ],
    "Telangana": [
        "Adilabad", "Bellampalle", "Bhadrachalam", "Bhongir", "Bodhan", "Gadwal", "Hyderabad", "Jagtial",
        "Jangaon", "Kamareddy", "Karimnagar", "Khammam", "Koratla", "Kothagudem", "Kottagudem", "Mahbubnagar",
        "Mancherial", "Mandamarri", "Manuguru", "Miryalaguda", "Nalgonda", "Nirmal", "Nizamabad", "Palwancha",
        "Ramagundam", "Sangareddy", "Sircilla", "Suryapet", "Tandur", "Vikarabad", "Wanaparthy", "Warangal",
        "Yellandu", "Zahirabad"
    ],
    "Tripura": [
        "Agartala", "Ambassa", "Belonia", "Dharmanagar", "Kailasahar", "Khowai", "Kumarghat", "Ranirbazar",
        "Santirbazar", "Teliamura", "Udaipur"
    ],
    "Uttar Pradesh": [
        "Agra", "Aligarh", "Allahabad", "Amroha", "Ayodhya", "Azamgarh", "Bahraich", "Ballia", "Banda",
        "Barabanki", "Bareilly", "Basti", "Bijnor", "Budaun", "Bulandshahr", "Chandausi", "Deoria", "Etah",
        "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Ghaziabad", "Ghazipur", "Gonda",
        "Gorakhpur", "Hapur", "Hardoi", "Hathras", "Jaunpur", "Jhansi", "Kanpur", "Kasganj", "Khushinagar",
        "Lakhimpur", "Lalitpur", "Lucknow", "Mainpuri", "Mathura", "Maunath Bhanjan", "Meerut", "Mirzapur",
        "Modinagar", "Moradabad", "Muzaffarnagar", "Noida", "Orai", "Pilibhit", "Raebareli", "Rampur",
        "Saharanpur", "Sambhal", "Shahjahanpur", "Shamli", "Shikohabad", "Sitapur", "Sultanpur", "Unnao", "Varanasi"
    ],
    "Uttarakhand": [
        "Almora", "Bageshwar", "Dehradun", "Haldwani", "Haridwar", "Kashipur", "Kotdwar", "Manglaur",
        "Mussoorie", "Nainital", "Pauri", "Pithoragarh", "Ramnagar", "Rishikesh", "Roorkee", "Rudrapur",
        "Srinagar", "Tehri", "Uttarkashi"
    ],
    "West Bengal": [
        "Alipurduar", "Arambag", "Asansol", "Baharampur", "Bally", "Balurghat", "Bankura", "Barasat",
        "Bardhaman", "Barasat", "Barrackpore", "Basirhat", "Bhatpara", "Bidhannagar", "Bongaon", "Burnpur",
        "Cooch Behar", "Darjeeling", "Durgapur", "English Bazar", "Haldia", "Howrah", "Hugli-Chinsurah",
        "Jalpaiguri", "Kalyani", "Kamarhati", "Kanchrapara", "Kharagpur", "Kolkata", "Krishnanagar",
        "Madhyamgram", "Malda", "Medinipur", "Nabadwip", "Naihati", "North Barrackpore", "North Dumdum",
        "Panihati", "Purulia", "Raiganj", "Rajarhat", "Ranaghat", "Rishra", "Santipur", "Serampore",
        "Siliguri", "South Dumdum", "Titagarh", "Uluberia"
    ],
    "Delhi": [
        "Adarsh Nagar", "Alipur", "Anand Vihar", "Ashok Vihar", "Badarpur", "Bawana", "Chanakyapuri", "Chandni Chowk",
        "Chhatarpur", "Civil Lines", "Connaught Place", "Daryaganj", "Defence Colony", "Delhi Cantonment", "Dwarka",
        "East of Kailash", "Gandhi Nagar", "Geeta Colony", "Greater Kailash", "Green Park", "Hauz Khas", "Inderlok",
        "Janakpuri", "Jangpura", "Kalkaji", "Karol Bagh", "Kashmere Gate", "Khan Market", "Kirti Nagar", "Lajpat Nagar",
        "Laxmi Nagar", "Lodhi Colony", "Malviya Nagar", "Mayur Vihar", "Mehrauli", "Model Town", "Moti Nagar",
        "Mukherjee Nagar", "Najafgarh", "Narela", "Nehru Place", "New Friends Colony", "Okhla", "Paharganj",
        "Palam", "Paschim Vihar", "Patel Nagar", "Pitampura", "Preet Vihar", "Punjabi Bagh", "R.K. Puram",
        "Rajendra Nagar", "Rajouri Garden", "Rohini", "Saket", "Sarita Vihar", "Sarojini Nagar", "Shahdara",
        "Shalimar Bagh", "South Extension", "Tilak Nagar", "Vasant Kunj", "Vasant Vihar", "Vikaspuri"
    ],
    "Jammu and Kashmir": [
        "Anantnag", "Baramulla", "Jammu", "Kathua", "Pulwama", "Sopore", "Srinagar", "Udhampur"
    ],
    "Ladakh": [
        "Kargil", "Leh"
    ],
    "Puducherry": [
        "Karaikal", "Mahe", "Puducherry", "Yanam", "Ozhukarai"
    ]
};

const INDIAN_STATES = Object.keys(STATE_CITY_MAP).sort();

const IDENTITY_PROOFS = [
    "Aadhar Card",
    "Voter ID",
    "Passport",
    "Driving License",
    "PAN Card"
];

const ADDRESS_PROOFS = [
    "Rental Agreement",
    "House Electricity Bill",
    "Water Bill",
    "Gas Company Bill",
    "Internet / WiFi Bill",
    "Bank Statement",
    "Passport"
];

export default function KYCPage() {
    const router = useRouter();
    const [customerType, setCustomerType] = useState('Customer'); // Customer | Company
    const [currentStep, setCurrentStep] = useState(1);

    // Refs for file uploads
    const identityProofRef = useRef(null);
    const addressProofRef = useRef(null);
    const bankStatementRef = useRef(null);

    // State management for cascading dropdowns
    const [formData, setFormData] = useState({
        personal: { state: '', city: '', pincode: '' },
        company: { state: '', city: '', pincode: '' },
        reference: { state: '', city: '', pincode: '' },
        documents: { identityProof: 'Voter ID', addressProof: 'House Electricity Bill' }
    });

    const handleDocumentChange = (type, value) => {
        setFormData(prev => ({
            ...prev,
            documents: { ...prev.documents, [type]: value }
        }));
    };

    const handleStateChange = (section, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], state: value, city: '' } // Reset city when state changes
        }));
    };

    const handleCityChange = (section, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], city: value }
        }));
    };

    const handlePincodeChange = async (section, value) => {
        // Allow only numbers
        if (!/^\d*$/.test(value)) return;

        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], pincode: value }
        }));

        // Fetch city/state if pincode is 6 digits
        if (value.length === 6) {
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
                const data = await response.json();

                if (data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
                    const details = data[0].PostOffice[0];
                    const fetchedState = details.State;
                    let fetchedCity = details.District;

                    // Normalize city names to match our list
                    // API returns "Nilgiris" / "The Nilgiris" for Ooty
                    const CITY_NORMALIZATION = {
                        "Nilgiris": "Ooty",
                        "The Nilgiris": "Ooty",
                        "Bangalore Urban": "Bangalore",
                        "Bengaluru": "Bangalore",
                        "Mysuru": "Mysore",
                        "Tumakuru": "Tumkur",
                        "Belagavi": "Belgaum",
                        "Kalaburagi": "Gulbarga",
                        "Vijayapura": "Bijapur",
                        "Shivamogga": "Shimoga",
                        "Thiruvananthapuram": "Thiruvananthapuram", // Matches
                        "Ernakulam": "Kochi", // Common mapping
                        "Cochin": "Kochi",
                        "Prayagraj": "Allahabad", // Legacy mapping if needed
                        "Gurugram": "Gurgaon"
                    };

                    if (CITY_NORMALIZATION[fetchedCity]) {
                        fetchedCity = CITY_NORMALIZATION[fetchedCity];
                    }

                    // Check if the fetched city exists in our map for that state
                    // This prevents selecting the first alphabetical city (e.g. Alandur) by mistake
                    // if the API returns a district we don't support.
                    const availableCities = STATE_CITY_MAP[fetchedState] || [];
                    const isCityAvailable = availableCities.includes(fetchedCity);

                    setFormData(prev => ({
                        ...prev,
                        [section]: {
                            ...prev[section],
                            state: fetchedState,
                            // Only auto-select if we have an exact match in our list
                            city: isCityAvailable ? fetchedCity : ''
                        }
                    }));
                }
            } catch (error) {
                console.error("Error fetching pincode details:", error);
            }
        }
    };

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
        else if (currentStep === 4) setCurrentStep(5);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    // Mock calculations
    const securityAmount = 5000;
    const deliveryCharges = 400;
    const monthlyRentTotal = 1100;
    const totalGST = 120;
    const totalOneTime = 6620;
    const payToday = 600;
    const savedAmount = 4030.00;

    return (
        <div className="min-h-screen bg-gray-50 font-sans mt-8">
            <div className="max-w-6xl mx-auto px-8 py-4">
                {/* Breadcrumb - Matches design */}
                <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
                    <Link href="/" className="hover:text-black font-medium font-sans">Product-Page</Link>
                    <span>›</span>
                    <Link href="/cart" className="hover:text-black font-medium font-sans">Cart</Link>
                    <span>›</span>
                    <Link href="/checkout/address" className="hover:text-black font-medium font-sans">Address</Link>
                    <span>›</span>
                    <span className="text-black font-medium font-sans">Verification</span>
                </div>

                {currentStep === 5 ? (
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 max-w-2xl w-full text-center relative">
                            <button
                                onClick={() => setCurrentStep(4)}
                                className="absolute top-8 left-8 flex items-center gap-2 text-red-500 border border-red-500 rounded-full px-4 py-1.5 hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                Back
                            </button>

                            <div className="flex justify-center mb-8 mt-4">
                                <div className="relative w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border-4 border-l-blue-500 border-t-blue-500 border-r-gray-200 border-b-gray-200 transform -rotate-45"></div>
                                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5 border-4 border-white">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-3xl font-semibold text-[#0056D2] mb-4">KYC in Progress</h2>
                            <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                                We are now reviewing your documents. This typically takes 24-48 hours. We will notify you via email as soon its complete.
                            </p>

                            <div className="flex justify-center gap-4">
                                <Link
                                    href="/profile/orders"
                                    className="bg-[#007bff] hover:bg-[#0069d9] text-white font-medium py-3 px-8 rounded-full transition-all shadow-md"
                                >
                                    Go To My Orders
                                </Link>
                                <button className="bg-[#333] hover:bg-black text-white font-medium py-3 px-8 rounded-full transition-all shadow-md">
                                    KYC Documentation
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column: KYC Form */}
                        <div className="lg:w-2/3">
                            <div className="relative rounded-2xl p-6 bg-gray-50/50">
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                                    <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="16" ry="16" fill="none" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="12 8" />
                                </svg>

                                <div className="flex items-center gap-4 mb-6">
                                    <h1 className="text-3xl font-semibold text-gray-900">KYC & Documentation</h1>
                                </div>

                                {/* Customer Type Toggle */}
                                <div className="flex gap-4 mb-6">
                                    <button
                                        onClick={() => setCustomerType('Customer')}
                                        className={`px-12 py-2.5 rounded-full text-lg font-medium transition-all ${customerType === 'Customer' ? 'bg-[#1D1D1F] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        Customer
                                    </button>
                                    <button
                                        onClick={() => setCustomerType('Company')}
                                        className={`px-12 py-2.5 rounded-full text-lg font-medium transition-all ${customerType === 'Company' ? 'bg-[#1D1D1F] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        Company
                                    </button>
                                </div>

                                {/* Green Banner */}
                                <div className="bg-[#E8F5E9] border border-[#4CAF50] rounded-xl p-4 mb-5 flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#C8E6C9] flex items-center justify-center text-[#2E7D32]">
                                        <FaFingerprint size={14} />
                                    </div>
                                    <span className="text-[#1B5E20] font-medium text-sm">Complete KYC to complete your order</span>
                                </div>

                                {/* Orange Warning Box */}
                                <div className="bg-[#FFF8E1] border border-[#FFD54F] rounded-2xl p-5 mb-8">
                                    <h3 className="text-gray-800 font-medium mb-3 text-sm">Keep your documents handy (physical or digital)</h3>
                                    <ul className="text-gray-600 text-sm space-y-2 pl-1 font-normal">
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 bg-gray-400 rounded-full"></span> Aadhar Card / Voter ID / Passport</li>
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 bg-gray-400 rounded-full"></span> Rental Agreement / House Electricity Bill</li>
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 bg-gray-400 rounded-full"></span> Bank Statement → 3 Months</li>
                                    </ul>
                                </div>

                                <div className="h-px bg-gray-200 w-full mb-8"></div>

                                {/* Form Container */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

                                    {/* Stepper */}
                                    <div className="w-full max-w-3xl mx-auto mb-12 mt-4 px-4">
                                        <div className="flex items-center justify-between w-full">
                                            {[
                                                { id: 1, label: 'Personal Details' },
                                                { id: 2, label: 'Company Details' },
                                                { id: 3, label: 'Reference Only' },
                                                { id: 4, label: 'Documents Upload' },
                                            ].map((step, index, arr) => {
                                                const isLast = index === arr.length - 1;
                                                const isCompleted = step.id < currentStep;
                                                const isActive = step.id === currentStep;
                                                const isLineActive = currentStep > step.id;

                                                return (
                                                    <React.Fragment key={step.id}>
                                                        {/* Step Circle & Label */}
                                                        <div className="flex flex-col items-center relative">
                                                            <div
                                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 z-10 border-[1.5px]
                                                                ${isCompleted ? 'bg-[#00c853] border-[#00c853] text-white' :
                                                                        isActive ? 'bg-white border-[#00c853] text-[#00c853] ring-4 ring-green-50' :
                                                                            'bg-white border-gray-200 text-gray-300'}`}
                                                            >
                                                                {isCompleted ? <PiCheckCircleFill size={16} /> : step.id}
                                                            </div>
                                                            <div className={`absolute top-10 w-32 text-center text-[10px] uppercase font-semibold tracking-wide transition-colors duration-300
                                                                ${isActive || isCompleted ? 'text-black' : 'text-gray-300'}`}>
                                                                {step.label}
                                                            </div>
                                                        </div>

                                                        {/* Connector Line */}
                                                        {!isLast && (
                                                            <div className="flex-1 h-[2px] mx-2 bg-gray-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full bg-[#00c853] transition-all duration-500 ease-out`}
                                                                    style={{ width: isLineActive ? '100%' : '0%' }}
                                                                ></div>
                                                            </div>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {currentStep === 1 && (
                                        <>
                                            <h2 className="text-xl font-medium text-gray-700 mb-2">Personal Details</h2>
                                            <div className="h-px bg-gray-600 w-full mb-4"></div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                                <div className="md:col-span-2">
                                                    <TextInput label="Name" required placeholder="Enter Your Full Name" />
                                                </div>
                                                <TextInput label="Father's / Mother's Name" required placeholder="" />
                                                <TextInput label="Father's / Mother's Number" required placeholder="Number" />

                                                <div className="md:col-span-2">
                                                    <TextInput label="Personal Email" required placeholder="Email" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <TextInput label="Mobile Number" required placeholder="Phone Number" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <TextInput label="Permanent Address" required placeholder="Address" />
                                                </div>

                                                <TextInput
                                                    label="City"
                                                    required
                                                    placeholder="Select City"
                                                    isSelect
                                                    options={formData.personal.state ? STATE_CITY_MAP[formData.personal.state] : []}
                                                    value={formData.personal.city}
                                                    onChange={(e) => handleCityChange('personal', e.target.value)}
                                                />
                                                <TextInput
                                                    label="State"
                                                    required
                                                    placeholder="Select State"
                                                    isSelect
                                                    options={INDIAN_STATES}
                                                    value={formData.personal.state}
                                                    onChange={(e) => handleStateChange('personal', e.target.value)}
                                                />
                                                <TextInput
                                                    label="Pincode"
                                                    required
                                                    placeholder=""
                                                    value={formData.personal.pincode}
                                                    onChange={(e) => handlePincodeChange('personal', e.target.value)}
                                                />
                                                <TextInput label="Country" required placeholder="India" isSelect options={["India"]} />
                                            </div>

                                            <button
                                                onClick={handleNext}
                                                className="w-full bg-[#333] hover:bg-black text-white font-medium py-1 rounded-full transition-all text-lg"
                                            >
                                                Start my KYC process
                                            </button>
                                        </>
                                    )}

                                    {currentStep === 2 && (
                                        <>
                                            <h2 className="text-xl font-medium text-gray-700 mb-2">Company Details</h2>
                                            <div className="h-px bg-gray-600 w-full mb-4"></div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                                <div className="md:col-span-2">
                                                    <TextInput label="Company Name" required placeholder="" />
                                                </div>
                                                <TextInput label="Type of Company" required placeholder="Placeholder" />
                                                <TextInput label="Approx no. of employee" required placeholder="Message" />

                                                <div className="md:col-span-2">
                                                    <TextInput label="Your Designation" required placeholder="" />
                                                </div>

                                                <TextInput label="Duration of Service in the company" required placeholder="Placeholder" />
                                                <TextInput label="Official Company email" required placeholder="Placeholder" />

                                                <div className="md:col-span-2">
                                                    <TextInput label="Reference Address" required placeholder="Placeholder" />
                                                </div>

                                                <TextInput
                                                    label="City"
                                                    required
                                                    placeholder="Select City"
                                                    isSelect
                                                    options={formData.company.state ? STATE_CITY_MAP[formData.company.state] : []}
                                                    value={formData.company.city}
                                                    onChange={(e) => handleCityChange('company', e.target.value)}
                                                />
                                                <TextInput
                                                    label="State"
                                                    required
                                                    placeholder="Select State"
                                                    isSelect
                                                    options={INDIAN_STATES}
                                                    value={formData.company.state}
                                                    onChange={(e) => handleStateChange('company', e.target.value)}
                                                />
                                                <TextInput
                                                    label="Pincode"
                                                    required
                                                    placeholder=""
                                                    value={formData.company.pincode}
                                                    onChange={(e) => handlePincodeChange('company', e.target.value)}
                                                />
                                                <TextInput label="Country" required placeholder="India" isSelect options={["India"]} />
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={handleBack}
                                                    className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-full transition-all text-lg"
                                                >
                                                    Start my KYC process
                                                </button>
                                                <button
                                                    onClick={handleNext}
                                                    className="w-1/2 bg-[#333] hover:bg-black text-white font-medium py-2 rounded-full transition-all text-lg shadow-lg"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {currentStep === 3 && (
                                        <>
                                            <h2 className="text-xl font-medium text-gray-700 mb-2">Reference Only</h2>
                                            <div className="h-px bg-gray-600 w-full mb-4"></div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                                <div className="md:col-span-2">
                                                    <TextInput label="Reference Name" required placeholder="" />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <TextInput label="Relation of the person" required placeholder="Placeholder" />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <TextInput label="Mobile No." required placeholder="Placeholder" />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <TextInput label="Reference Address" required placeholder="Placeholder" />
                                                </div>

                                                <TextInput
                                                    label="City"
                                                    required
                                                    placeholder="Select City"
                                                    isSelect
                                                    options={formData.reference.state ? STATE_CITY_MAP[formData.reference.state] : []}
                                                    value={formData.reference.city}
                                                    onChange={(e) => handleCityChange('reference', e.target.value)}
                                                />
                                                <TextInput
                                                    label="State"
                                                    required
                                                    placeholder="Select State"
                                                    isSelect
                                                    options={INDIAN_STATES}
                                                    value={formData.reference.state}
                                                    onChange={(e) => handleStateChange('reference', e.target.value)}
                                                />
                                                <TextInput
                                                    label="Pincode"
                                                    required
                                                    placeholder=""
                                                    value={formData.reference.pincode}
                                                    onChange={(e) => handlePincodeChange('reference', e.target.value)}
                                                />
                                                <TextInput label="Country" required placeholder="India" isSelect options={["India"]} />
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={handleBack}
                                                    className="w-1/2 bg-[#333] hover:bg-black text-white font-medium py-2 rounded-full transition-all text-lg"
                                                >
                                                    Start my KYC process
                                                </button>
                                                <button
                                                    onClick={handleNext}
                                                    className="w-1/2 bg-[#333] hover:bg-black text-white font-medium py-2 rounded-full transition-all text-lg shadow-lg"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {currentStep === 4 && (
                                        <>
                                            <h2 className="text-xl font-medium text-gray-700 mb-2">Documents Upload</h2>
                                            <div className="h-px bg-gray-600 w-full mb-6"></div>

                                            <div className="space-y-6 mb-8">
                                                {/* Identity Proof */}
                                                <div>
                                                    <TextInput
                                                        label="Identity Proof"
                                                        required
                                                        placeholder="Select Identity Proof"
                                                        isSelect
                                                        options={IDENTITY_PROOFS}
                                                        value={formData.documents.identityProof}
                                                        onChange={(e) => handleDocumentChange('identityProof', e.target.value)}
                                                    />
                                                    <div className="p-1 mb-1 mt-3">
                                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                            {formData.documents.identityProof} <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="file"
                                                            ref={identityProofRef}
                                                            className="hidden"
                                                            accept="image/*,.pdf"
                                                            onChange={(e) => console.log(e.target.files[0])}
                                                        />
                                                        <button
                                                            onClick={() => identityProofRef.current.click()}
                                                            className="flex items-center gap-2 text-blue-600 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors text-xs font-medium"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                            Attach File
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="h-px bg-gray-200 w-full"></div>

                                                {/* Address Proof */}
                                                <div>
                                                    <TextInput
                                                        label="Address Proof"
                                                        required
                                                        placeholder="Select Address Proof"
                                                        isSelect
                                                        options={ADDRESS_PROOFS}
                                                        value={formData.documents.addressProof}
                                                        onChange={(e) => handleDocumentChange('addressProof', e.target.value)}
                                                    />
                                                    <div className="p-1 mb-1 mt-3">
                                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                            {formData.documents.addressProof} <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="file"
                                                            ref={addressProofRef}
                                                            className="hidden"
                                                            accept="image/*,.pdf"
                                                            onChange={(e) => console.log(e.target.files[0])}
                                                        />
                                                        <button
                                                            onClick={() => addressProofRef.current.click()}
                                                            className="flex items-center gap-2 text-blue-600 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors text-xs font-medium"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                            Attach File
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="h-px bg-gray-200 w-full"></div>

                                                {/* Bank Statement */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                        Bank Statement → 3 Months <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="file"
                                                        ref={bankStatementRef}
                                                        className="hidden"
                                                        accept="image/*,.pdf"
                                                        onChange={(e) => console.log(e.target.files[0])}
                                                    />
                                                    <button
                                                        onClick={() => bankStatementRef.current.click()}
                                                        className="flex items-center gap-2 text-blue-600 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors text-xs font-medium"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                        Attach File
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 mb-8">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                    By checking this box, I acknowledge that I have read and accepted the <span className="font-bold">**Privacy Policy**</span>, and I <span className="text-red-500">*</span> consent to the use of my provided documents and data for the sole purpose of identity verification and rental agreement processing.
                                                </p>
                                            </div>

                                            <button className="w-full bg-[#333] hover:bg-black text-white font-medium py-3 rounded-full transition-all text-lg shadow-lg" onClick={handleNext}>
                                                Start my KYC process
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:w-1/3">
                            <OrderSummary
                                securityAmount={securityAmount}
                                deliveryCharges={deliveryCharges}
                                monthlyRentTotal={monthlyRentTotal}
                                totalGST={totalGST}
                                totalOneTime={totalOneTime}
                                payToday={payToday}
                                savedAmount={savedAmount}
                                paymentConfirmed={true} // Enable the confirmed state
                                showButton={false}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const TextInput = ({ label, required, placeholder, isSelect, options, value, onChange }) => (
    <div className="w-full">
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {isSelect ? (
                options && options.length > 0 ? (
                    <div className="relative">
                        <select
                            className="w-full appearance-none border border-gray-300 rounded-lg px-2 py-2 bg-white text-gray-700 text-sm focus:outline-none focus:border-black transition-colors font-sans cursor-pointer"
                            value={value}
                            onChange={onChange}
                        >
                            <option value="" disabled className="text-gray-400">{placeholder || 'Select'}</option>
                            {options.map((opt, idx) => (
                                <option key={idx} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                ) : (
                    <div className="w-full border border-gray-300 rounded-lg px-2 py-2 bg-white text-gray-400 text-sm flex justify-between items-center cursor-pointer font-sans">
                        <span>{placeholder || 'Select State First'}</span>
                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                )
            ) : (
                <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-black transition-colors placeholder-gray-300 font-sans"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            )}
        </div>
        {!isSelect && <p className="text-[10px] text-gray-500 mt-1 font-medium">Message</p>}
    </div>
);
