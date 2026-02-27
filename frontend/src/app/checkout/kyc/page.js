'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FaFingerprint } from 'react-icons/fa';
import { PiCheckCircleFill, PiCheckCircle } from 'react-icons/pi';
import { saveKYCData, uploadKYCFiles } from '../../../services/kycService';
import { selectCartTotals } from '../../../redux/features/cartSlice';
import OrderSummary from '../../../components/OrderSummary';
import Swal from 'sweetalert2';

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
    const totals = useSelector(selectCartTotals);
    const { securityAmount, deliveryCharges, monthlyRentTotal, totalGST, totalOneTime, payToday, savedAmount } = totals;

    const [customerType, setCustomerType] = useState('Customer');
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Refs for file uploads
    const identityProofRef = useRef(null);
    const addressProofRef = useRef(null);
    const bankStatementRef = useRef(null);

    // Form data state
    const [formData, setFormData] = useState({
        personal: { name: '', fatherName: '', fatherPhone: '', email: '', phone: '', address: '', state: '', city: '', pincode: '' },
        company: { companyName: '', companyType: '', employees: '', designation: '', duration: '', email: '', address: '', state: '', city: '', pincode: '' },
        reference: { name: '', relation: '', phone: '', address: '', state: '', city: '', pincode: '' },
        documents: { identityProof: 'Voter ID', addressProof: 'House Electricity Bill' }
    });

    const [isDocumentsChecked, setIsDocumentsChecked] = useState(false);

    const handleTextChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleCityChange = (section, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], city: value }
        }));
        if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
    };

    const handleStateChange = (section, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], state: value, city: '' }
        }));
        if (errors.state) setErrors(prev => ({ ...prev, state: '' }));
    };

    const handlePincodeChange = async (section, value) => {
        if (!/^\d*$/.test(value)) return;
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], pincode: value } }));
        if (errors.pincode) setErrors(prev => ({ ...prev, pincode: '' }));

        if (value.length === 6) {
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
                const data = await response.json();
                if (data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
                    const details = data[0].PostOffice[0];
                    const fetchedState = details.State;
                    let fetchedCity = details.District;

                    const CITY_NORMALIZATION = { "Nilgiris": "Ooty", "The Nilgiris": "Ooty", "Bangalore Urban": "Bangalore", "Bengaluru": "Bangalore", "Mysuru": "Mysore", "Tumakuru": "Tumkur", "Belagavi": "Belgaum", "Kalaburagi": "Gulbarga", "Vijayapura": "Bijapur", "Shivamogga": "Shimoga", "Thiruvananthapuram": "Thiruvananthapuram", "Ernakulam": "Kochi", "Cochin": "Kochi", "Prayagraj": "Allahabad", "Gurugram": "Gurgaon" };
                    if (CITY_NORMALIZATION[fetchedCity]) fetchedCity = CITY_NORMALIZATION[fetchedCity];

                    const availableCities = STATE_CITY_MAP[fetchedState] || [];
                    const isCityAvailable = availableCities.includes(fetchedCity);

                    setFormData(prev => ({ ...prev, [section]: { ...prev[section], state: fetchedState, city: isCityAvailable ? fetchedCity : '' } }));
                }
            } catch (err) { console.error(err); }
        }
    };

    const validateStep1 = () => {
        const { name, fatherName, fatherPhone, email, phone, address, state, city, pincode } = formData.personal;
        let newErrors = {};
        if (!name) newErrors.name = 'Required';
        if (!fatherName) newErrors.fatherName = 'Required';
        if (!fatherPhone) newErrors.fatherPhone = 'Required';
        if (!email) newErrors.email = 'Required';
        if (!phone) newErrors.phone = 'Required';
        if (!address) newErrors.address = 'Required';
        if (!state) newErrors.state = 'Required';
        if (!city) newErrors.city = 'Required';
        if (!pincode) newErrors.pincode = 'Required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const { companyName, companyType, employees, designation, duration, email } = formData.company;
        let newErrors = {};
        if (!companyName) newErrors.companyName = 'Required';
        if (!companyType) newErrors.companyType = 'Required';
        if (!employees) newErrors.employees = 'Required';
        if (!designation) newErrors.designation = 'Required';
        if (!duration) newErrors.duration = 'Required';
        if (!email) newErrors.email = 'Required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        console.log('Next clicked. Step:', currentStep);
        if (currentStep === 1) {
            if (!validateStep1()) { console.log('Step 1 invalid', errors); return; }
        }

        if (currentStep === 2 && customerType === 'Company') {
            if (!validateStep2()) return;
        }

        if (currentStep === 4) {
            if (!isDocumentsChecked) {
                Swal.fire({ icon: 'warning', title: 'Action Required', text: 'Please check the confirmation box.' });
                return;
            }
        }

        if (currentStep === 1 && customerType === 'Customer') {
            setCurrentStep(3);
        } else if (currentStep < 5) {
            if (currentStep === 4) {
                setLoading(true);
                try {
                    const fileData = new FormData();
                    if (identityProofRef.current?.files[0]) fileData.append('identityProof', identityProofRef.current.files[0]);
                    if (addressProofRef.current?.files[0]) fileData.append('addressProof', addressProofRef.current.files[0]);
                    if (bankStatementRef.current?.files[0]) fileData.append('bankStatement', bankStatementRef.current.files[0]);

                    let uploadedDocs = {};
                    if ([...fileData.entries()].length > 0) {
                        uploadedDocs = await uploadKYCFiles(fileData);
                    }

                    await saveKYCData({
                        personalDetails: formData.personal,
                        companyDetails: customerType === 'Company' ? formData.company : {},
                        referenceDetails: formData.reference,
                        documents: uploadedDocs
                    });

                    setCurrentStep(5);
                } catch (error) {
                    console.error(error);
                    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to submit KYC.' });
                } finally {
                    setLoading(false);
                }
            } else {
                setCurrentStep(prev => prev + 1);
            }
        }
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        if (currentStep === 3 && customerType === 'Customer') {
            setCurrentStep(1);
        } else if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
        window.scrollTo(0, 0);
    };


    return (
        <div className="min-h-screen bg-gray-50 font-sans mt-8">
            <div className="max-w-6xl mx-auto px-8 py-4">
                {/* Breadcrumb */}
                {currentStep !== 5 && (
                    <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
                        <Link href="/" className="hover:text-black font-medium font-sans">Product-Page</Link>
                        <span>›</span>
                        <Link href="/cart" className="hover:text-black font-medium font-sans">Cart</Link>
                        <span>›</span>
                        <Link href="/checkout/address" className="hover:text-black font-medium font-sans">Address</Link>
                        <span>›</span>
                        <span className="text-black font-medium font-sans">Verification</span>
                    </div>
                )}

                {currentStep === 5 ? (
                    <div className="flex justify-center items-center min-h-[60vh] px-4">
                        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-lg px-8 py-12 text-center">

                            {/* Back Button */}
                            <button
                                onClick={() => setCurrentStep(1)}
                                className="absolute top-6 left-6 flex items-center gap-2 text-red-500 border border-red-500 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-red-50 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                Back
                            </button>

                            {/* Illustration */}
                            <div className="flex justify-center mb-10 mt-4">
                                <div className="relative w-56 h-56 flex items-center justify-center">
                                    <div className="absolute inset-6 rounded-full bg-blue-500/10 blur-2xl"></div>
                                    <svg viewBox="0 0 200 200" className="relative z-10 w-full h-full" fill="none">
                                        <circle cx="100" cy="100" r="80" stroke="#E5E7EB" strokeWidth="10" />
                                        <path d="M 100 20 A 80 80 0 0 0 43.4 156.6" stroke="#0B5ED7" strokeWidth="10" strokeLinecap="round" fill="none" />
                                        <circle cx="100" cy="100" r="58" fill="#F8FAFF" />
                                        <g transform="translate(40, 84)">
                                            <circle cx="12" cy="12" r="14" fill="#0B5ED7" stroke="white" strokeWidth="3" />
                                            <path d="M7 12 L11 16 L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            <h2 className="text-4xl font-semibold text-[#0B5ED7] mb-4">KYC in Progress</h2>
                            <p className="text-gray-900 text-[15px] font-medium max-w-xl mx-auto mb-6">
                                We are now reviewing your documents. This typically takes 24–48 hours.
                                We will notify you via email as soon as it’s complete.
                            </p>

                            <div className="flex justify-center gap-6">
                                <Link href="/profile/orders" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2 rounded-3xl font-normal shadow-lg transition">Go To My Orders</Link>
                                <button className="bg-[#4B5563] hover:bg-[#374151] text-white px-6 py-2 rounded-3xl font-normal shadow-lg transition">KYC Documentation</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-2/3">
                            <div className="relative rounded-2xl p-6 bg-gray-50/50">
                                <div className="flex items-center gap-4 mb-6">
                                    <h1 className="text-3xl font-semibold text-gray-900">KYC & Documentation</h1>
                                </div>

                                {/* Customer Type Toggle */}
                                <div className="flex gap-4 mb-6">
                                    <button onClick={() => { setCustomerType('Customer'); setCurrentStep(1); setErrors({}); }} className={`px-12 py-2.5 rounded-full text-lg font-medium transition-all ${customerType === 'Customer' ? 'bg-[#1D1D1F] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Customer</button>
                                    <button onClick={() => { setCustomerType('Company'); setCurrentStep(1); setErrors({}); }} className={`px-12 py-2.5 rounded-full text-lg font-medium transition-all ${customerType === 'Company' ? 'bg-[#1D1D1F] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Company</button>
                                </div>

                                <div className="bg-[#E8F5E9] border border-[#4CAF50] rounded-xl p-4 mb-5 flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#C8E6C9] flex items-center justify-center text-[#2E7D32]"><FaFingerprint size={14} /></div>
                                    <span className="text-[#1B5E20] font-medium text-sm">Complete KYC to complete your order</span>
                                </div>

                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    {/* Stepper */}
                                    <div className="w-full max-w-3xl mx-auto mb-12 mt-4 px-4">
                                        <div className="flex items-center justify-between w-full">
                                            {[{ id: 1, label: 'Personal Details' }, { id: 2, label: 'Company Details' }, { id: 3, label: 'Reference Only' }, { id: 4, label: 'Documents Upload' }].map((step, index, arr) => {
                                                const isLast = index === arr.length - 1;
                                                const isCompleted = step.id < currentStep;
                                                const isActive = step.id === currentStep;
                                                const isLineActive = currentStep > step.id;

                                                return (
                                                    <React.Fragment key={step.id}>
                                                        <div className="flex flex-col items-center relative">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 z-10 border-[1.5px] ${isCompleted ? 'bg-[#00c853] border-[#00c853] text-white' : isActive ? 'bg-white border-[#00c853] text-[#00c853] ring-4 ring-green-50' : 'bg-white border-gray-200 text-gray-300'}`}>
                                                                {isCompleted ? <PiCheckCircleFill size={16} /> : step.id}
                                                            </div>
                                                            <div className={`absolute top-10 w-32 text-center text-[10px] uppercase font-semibold tracking-wide transition-colors duration-300 ${isActive || isCompleted ? 'text-black' : 'text-gray-300'}`}>{step.label}</div>
                                                        </div>
                                                        {!isLast && (
                                                            <div className="flex-1 h-[2px] mx-2 bg-gray-100 rounded-full overflow-hidden">
                                                                <div className={`h-full bg-[#00c853] transition-all duration-500 ease-out`} style={{ width: isLineActive ? '100%' : '0%' }}></div>
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
                                                <div className="md:col-span-2"><TextInput label="Name" required error={errors.name} value={formData.personal.name} onChange={(e) => handleTextChange('personal', 'name', e.target.value)} /></div>
                                                <TextInput label="Father's / Mother's Name" required error={errors.fatherName} value={formData.personal.fatherName} onChange={(e) => handleTextChange('personal', 'fatherName', e.target.value)} />
                                                <TextInput label="Father's / Mother's Number" required error={errors.fatherPhone} value={formData.personal.fatherPhone} onChange={(e) => handleTextChange('personal', 'fatherPhone', e.target.value)} />
                                                <div className="md:col-span-2"><TextInput label="Personal Email" required error={errors.email} value={formData.personal.email} onChange={(e) => handleTextChange('personal', 'email', e.target.value)} /></div>
                                                <div className="md:col-span-2"><TextInput label="Mobile Number" required error={errors.phone} value={formData.personal.phone} onChange={(e) => handleTextChange('personal', 'phone', e.target.value)} /></div>
                                                <div className="md:col-span-2"><TextInput label="Permanent Address" required error={errors.address} value={formData.personal.address} onChange={(e) => handleTextChange('personal', 'address', e.target.value)} /></div>
                                                <TextInput label="City" required error={errors.city} value={formData.personal.city} onChange={(e) => handleCityChange('personal', e.target.value)} />
                                                <TextInput label="State" required isSelect options={INDIAN_STATES} error={errors.state} value={formData.personal.state} onChange={(e) => handleStateChange('personal', e.target.value)} />
                                                <TextInput label="Pincode" required error={errors.pincode} value={formData.personal.pincode} onChange={(e) => handlePincodeChange('personal', e.target.value)} />
                                                <TextInput label="Country" required isSelect options={["India"]} value="India" readOnly />
                                            </div>
                                            <button onClick={handleNext} className="w-full bg-[#333] hover:bg-black text-white font-medium py-3 rounded-full transition-all text-lg">{customerType === 'Customer' ? 'Proceed to Reference' : 'Proceed to Company Details'}</button>
                                        </>
                                    )}

                                    {currentStep === 2 && (
                                        <>
                                            <h2 className="text-xl font-medium text-gray-700 mb-2">Company Details</h2>
                                            <div className="h-px bg-gray-600 w-full mb-4"></div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                                <div className="md:col-span-2"><TextInput label="Company Name" required error={errors.companyName} value={formData.company.companyName} onChange={(e) => handleTextChange('company', 'companyName', e.target.value)} /></div>
                                                <TextInput label="Type of Company" required error={errors.companyType} value={formData.company.companyType} onChange={(e) => handleTextChange('company', 'companyType', e.target.value)} />
                                                <TextInput label="No. of Employees" required error={errors.employees} value={formData.company.employees} onChange={(e) => handleTextChange('company', 'employees', e.target.value)} />
                                                <div className="md:col-span-2"><TextInput label="Designation" required error={errors.designation} value={formData.company.designation} onChange={(e) => handleTextChange('company', 'designation', e.target.value)} /></div>
                                                <TextInput label="Duration" required error={errors.duration} value={formData.company.duration} onChange={(e) => handleTextChange('company', 'duration', e.target.value)} />
                                                <TextInput label="Company Email" required error={errors.email} value={formData.company.email} onChange={(e) => handleTextChange('company', 'email', e.target.value)} />
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={handleBack} className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-full transition-all text-lg">Back</button>
                                                <button onClick={handleNext} className="w-1/2 bg-[#333] hover:bg-black text-white font-medium py-2 rounded-full transition-all text-lg">Next</button>
                                            </div>
                                        </>
                                    )}

                                    {currentStep === 3 && (
                                        <>
                                            <h2 className="text-xl font-medium text-gray-700 mb-2">Reference Details</h2>
                                            <div className="h-px bg-gray-600 w-full mb-4"></div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                                <div className="md:col-span-2"><TextInput label="Reference Name" value={formData.reference.name} onChange={(e) => handleTextChange('reference', 'name', e.target.value)} /></div>
                                                <TextInput label="Relation" value={formData.reference.relation} onChange={(e) => handleTextChange('reference', 'relation', e.target.value)} />
                                                <TextInput label="Phone" value={formData.reference.phone} onChange={(e) => handleTextChange('reference', 'phone', e.target.value)} />
                                                <div className="md:col-span-2"><TextInput label="Address" value={formData.reference.address} onChange={(e) => handleTextChange('reference', 'address', e.target.value)} /></div>
                                                <TextInput label="City" value={formData.reference.city} onChange={(e) => handleCityChange('reference', e.target.value)} />
                                                <TextInput label="State" isSelect options={INDIAN_STATES} value={formData.reference.state} onChange={(e) => handleStateChange('reference', e.target.value)} />
                                                <TextInput label="Pincode" value={formData.reference.pincode} onChange={(e) => handlePincodeChange('reference', e.target.value)} />
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={handleBack} className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-full transition-all text-lg">Back</button>
                                                <button onClick={handleNext} className="w-1/2 bg-[#333] hover:bg-black text-white font-medium py-2 rounded-full transition-all text-lg">Proceed to Documents</button>
                                            </div>
                                        </>
                                    )}

                                    {currentStep === 4 && (
                                        <>
                                            <h2 className="text-xl font-medium text-gray-700 mb-2">Document Upload</h2>
                                            <div className="h-px bg-gray-600 w-full mb-4"></div>
                                            <div className="space-y-6 mb-8">
                                                <div>
                                                    <TextInput label="Identity Proof" isSelect options={["Aadhar Card", "Voter ID", "Passport", "Driving License", "PAN Card"]} value={formData.documents.identityProof} onChange={(e) => handleTextChange('documents', 'identityProof', e.target.value)} />
                                                    <input type="file" ref={identityProofRef} accept="image/*,.pdf" className="mt-2 text-sm" />
                                                </div>
                                                <div>
                                                    <TextInput label="Address Proof" isSelect options={["Rental Agreement", "House Electricity Bill", "Water Bill", "Gas Company Bill"]} value={formData.documents.addressProof} onChange={(e) => handleTextChange('documents', 'addressProof', e.target.value)} />
                                                    <input type="file" ref={addressProofRef} accept="image/*,.pdf" className="mt-2 text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Bank Statement (Last 3 months)</label>
                                                    <input type="file" ref={bankStatementRef} accept="image/*,.pdf" className="text-sm" />
                                                </div>
                                                <div className="flex items-center gap-2 mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                                    <input type="checkbox" checked={isDocumentsChecked} onChange={(e) => setIsDocumentsChecked(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                                                    <label className="text-sm text-gray-800">I confirm that the uploaded documents are valid and belong to me.</label>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={handleBack} className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-full transition-all text-lg">Back</button>
                                                <button onClick={handleNext} disabled={loading} className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-full transition-all text-lg">{loading ? 'Submitting...' : 'Submit Application'}</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/3">
                            <OrderSummary
                                monthlyRentTotal={monthlyRentTotal}
                                totalGST={totalGST}
                                totalOneTime={totalOneTime}
                                payToday={payToday}
                                savedAmount={savedAmount}
                                paymentConfirmed={true}
                                showButton={false}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const TextInput = ({ label, required, placeholder, isSelect, options, value, onChange, error, readOnly }) => (
    <div className="w-full">
        <label className="block text-xs font-medium text-gray-700 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
        <div className="relative">
            {isSelect ? (
                <div className="relative">
                    <select className={`w-full appearance-none border rounded-lg px-2 py-2 bg-white text-gray-700 text-sm focus:outline-none transition-colors font-sans cursor-pointer ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black'}`} value={value} onChange={onChange} disabled={readOnly}>
                        <option value="" disabled>{placeholder || 'Select'}</option>
                        {options && options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            ) : (
                <input type="text" className={`w-full border rounded-lg px-2 py-2 text-sm focus:outline-none transition-colors placeholder-gray-300 font-sans ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black'}`} placeholder={placeholder} value={value} onChange={onChange} readOnly={readOnly} />
            )}
        </div>
        {error && <p className="text-red-500 text-[10px] mt-1 font-medium">{error}</p>}
    </div>
);
