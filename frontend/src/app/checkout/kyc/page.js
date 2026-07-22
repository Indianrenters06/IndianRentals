'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FaFingerprint } from 'react-icons/fa';
import { PiCheckCircleFill, PiCheckCircle, PiCaretLeftBold } from 'react-icons/pi';
import { saveKYCData, uploadKYCFiles } from '../../../services/kycService';
import { selectCartTotals } from '../../../redux/features/cartSlice';
import OrderSummary from '../../../components/OrderSummary';
import Swal from 'sweetalert2';

const STATE_CITY_MAP = {
    "Andhra Pradesh": ["Adoni", "Amalapuram", "Anakapalle", "Anantapur", "Bapatla", "Bhimavaram", "Chirala", "Chittoor", "Dharmavaram", "Eluru", "Gudivada", "Gudur", "Guntakal", "Guntur", "Hindupur", "Kadapa", "Kakinada", "Kavali", "Kurnool", "Machilipatnam", "Madanapalle", "Nandyal", "Narasaraopet", "Nellore", "Ongole", "Proddatur", "Rajahmundry", "Srikakulam", "Tadepalligudem", "Tadpatri", "Tenali", "Tirupati", "Vijayawada", "Visakhapatnam", "Vizianagaram"],
    "Arunachal Pradesh": ["Aalo", "Anini", "Basar", "Bomdila", "Changlang", "Daporijo", "Hawai", "Itanagar", "Jairampur", "Khonsa", "Koloriang", "Longding", "Miao", "Naharlagun", "Namsai", "Pasighat", "Roing", "Seppa", "Tawang", "Tezu", "Yingkiong", "Ziro"],
    "Assam": ["Barpeta", "Bongaigaon", "Dhemaji", "Dhubri", "Dibrugarh", "Diphu", "Goalpara", "Golaghat", "Guwahati", "Haflong", "Hailakandi", "Hojai", "Jorhat", "Karimganj", "Kokrajhar", "Lanka", "Lumding", "Mangaldoi", "Mankachar", "Margherita", "Mariani", "Nagaon", "Nalbari", "North Lakhimpur", "Rangia", "Sibsagar", "Silapathar", "Silchar", "Tezpur", "Tinsukia", "Udalguri"],
    "Bihar": ["Araria", "Arrah", "Aurangabad", "Bagaha", "Begusarai", "Bettiah", "Bhabua", "Bhagalpur", "Bihar Sharif", "Buxar", "Chhapra", "Darbhanga", "Dehri", "Gaya", "Gopalganj", "Hajipur", "Jamalpur", "Jamui", "Jehanabad", "Katihar", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Motihari", "Munger", "Muzaffarpur", "Nawada", "Patna", "Purnia", "Saharsa", "Samastipur", "Sasaram", "Sheikhpura", "Sitamarhi", "Siwan", "Supaul"],
    "Chhattisgarh": ["Ambikapur", "Bhatapara", "Bhilai", "Bilaspur", "Chirmiri", "Dalli-Rajhara", "Dhamtari", "Durg", "Jagdalpur", "Kanker", "Kawardha", "Korba", "Mahasamund", "Manendragarh", "Mungeli", "Naila Janjgir", "Raigarh", "Raipur", "Rajnandgaon", "Sakti", "Tilda Newra"],
    "Goa": ["Bicholim", "Canacona", "Curchorem", "Cuncolim", "Mapusa", "Margao", "Mormugao", "Panaji", "Pernem", "Ponda", "Quepem", "Sanguem", "Sanquelim", "Valpoi", "Vasco da Gama"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Anjar", "Ankleshwar", "Bardoli", "Bharuch", "Bhavnagar", "Bhuj", "Botad", "Dahod", "Deesa", "Dhoraji", "Gandhidham", "Gandhinagar", "Godhra", "Gondal", "Himmatnagar", "Jamnagar", "Jetpur", "Junagadh", "Kalol", "Keshod", "Khambhat", "Mahesana", "Modasa", "Morbi", "Nadiad", "Navsari", "Palanpur", "Patan", "Porbandar", "Rajkot", "Savarkundla", "Sidhpur", "Surat", "Surendranagar", "Una", "Unjha", "Upleta", "Vadodara", "Valsad", "Vapi", "Veraval", "Visnagar", "Wankaner"],
    "Haryana": ["Ambala", "Ambala Cantt", "Bahadurgarh", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gohana", "Gurgaon", "Hansi", "Hisar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mandi Dabwali", "Narnaul", "Narwana", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Thanesar", "Tohana", "Yamunanagar"],
    "Himachal Pradesh": ["Baddi", "Bilaspur", "Chamba", "Dalhousie", "Dharamshala", "Hamirpur", "Kangra", "Kullu", "Mandi", "Manali", "Nahan", "Nalagarh", "Palampur", "Paonta Sahib", "Parwanoo", "Shimla", "Solan", "Sundarnagar", "Una"],
    "Jharkhand": ["Adityapur", "Bokaro", "Chaibasa", "Chakradharpur", "Chatra", "Daltonganj", "Deoghar", "Dhanbad", "Dumka", "Giridih", "Gumia", "Hazaribagh", "Jamshedpur", "Jhumri Tilaiya", "Lohardaga", "Madhupur", "Medininagar", "Pakur", "Phusro", "Ramgarh", "Ranchi", "Sahibganj", "Saunda", "Simdega"],
    "Karnataka": ["Bagalkot", "Bangalore", "Belgaum", "Bellary", "Bhadravati", "Bidar", "Bijapur", "Chikmagalur", "Chikutir", "Chintamani", "Chitradurga", "Davangere", "Dharwad", "Gadag-Betigeri", "Gangawati", "Gokak", "Gulbarga", "Hassan", "Haveri", "Hospet", "Hubli", "Karwar", "Kolar", "Koppal", "Mandya", "Mangalore", "Mysore", "Nipani", "Raichur", "Ramanagaram", "Ranibennur", "Robertson Pet", "Sagar", "Shimoga", "Sirsi", "Tumkur", "Udupi", "Yadgir"],
    "Kerala": ["Adoor", "Alappuzha", "Aluva", "Angamaly", "Attingal", "Chalakudy", "Changanassery", "Chengannur", "Cherthala", "Chittur-Thathamangalam", "Guruvayoor", "Irinjalakuda", "Kalamassery", "Kanhangad", "Kannur", "Kasaragod", "Kayamkulam", "Kochi", "Kodungallur", "Kollam", "Kottayam", "Koyilandy", "Kozhikode", "Kunnamkulam", "Malappuram", "Manjeri", "Mattannur", "Mavelikkara", "Muvattupuzha", "Nedumangad", "Neyyattinkara", "Nilambur", "Ottappalam", "Palai", "Palakkad", "Ponnani", "Punalur", "Shoranur", "Taliparamba", "Thiruvalla", "Thiruvananthapuram", "Thodupuzha", "Thrissur", "Tirur", "Varkala", "Vadakara"],
    "Madhya Pradesh": ["Ashoknagar", "Balaghat", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Itarsi", "Jabalpur", "Khandwa", "Khargone", "Mandsaur", "Morena", "Murwara", "Nagda", "Neemuch", "Pithampur", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Singrauli", "Tikamgarh", "Ujjain", "Vidisha"],
    "Maharashtra": ["Achalpur", "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Baramati", "Beed", "Bhandara", "Bhiwandi", "Bhusawal", "Bid", "Buldana", "Chandrapur", "Dhule", "Gondia", "Hinganghat", "Ichalkaranji", "Jalgaon", "Jalna", "Kalyan-Dombivli", "Karad", "Kolhapur", "Latur", "Malegaon", "Mira-Bhayandar", "Mumbai", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Navi Mumbai", "Osmanabad", "Palghar", "Panvel", "Parbhani", "Phaltan", "Pimpri-Chinchwad", "Pune", "Ratnagiri", "Sangli", "Satara", "Solapur", "Thane", "Udgir", "Ulhasnagar", "Vasai-Virar", "Wardha", "Yavatmal"],
    "Manipur": ["Bishnupur", "Churachandpur", "Imphal", "Jiribam", "Kakching", "Lilong", "Mayang Imphal", "Nambol", "Thoubal", "Ukhrul", "Wangjing", "Yairipok"],
    "Meghalaya": ["Baghmara", "Jowai", "Nongpoh", "Nongstoin", "Resubelpara", "Shillong", "Tura", "Williamnagar"],
    "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
    "Nagaland": ["Chumukedima", "Dimapur", "Kohima", "Mokokchung", "Mon", "Phek", "Tuensang", "Wokha", "Zunheboto"],
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Baripada", "Berhampur", "Bhadrak", "Bhawanipatna", "Bhubaneswar", "Brahmapur", "Brajarajnagar", "Byasanagar", "Cuttack", "Dhenkanal", "Jeypore", "Jharsuguda", "Kendujhar", "Paradip", "Puri", "Rayagada", "Rourkela", "Sambalpur", "Sunabeda"],
    "Punjab": ["Abohar", "Amritsar", "Barnala", "Batala", "Bathinda", "Dhuri", "Faridkot", "Fazilka", "Firozpur", "Firozpur Cantt", "Gurdaspur", "Hoshiarpur", "Jagraon", "Jalandhar", "Kapurthala", "Khanna", "Kot Kapura", "Ludhiana", "Malerkotla", "Malout", "Mansa", "Moga", "Mohali", "Muktsar", "Nabha", "Pathankot", "Patiala", "Phagwara", "Rajpura", "Rupnagar", "Sangrur", "Sunam", "Tarn Taran"],
    "Rajasthan": ["Ajmer", "Alwar", "Amarsar", "Balotra", "Banswara", "Baran", "Barmer", "Beawar", "Bharatpur", "Bhilwara", "Bhiwadi", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Hindaun", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kishangarh", "Kota", "Kuchaman City", "Ladnun", "Madanganj", "Makrana", "Nagaur", "Nawalgarh", "Nimbahera", "Nohar", "Pali", "Phalodi", "Pilani", "Pratapgarh", "Pushkar", "Rajsamand", "Ratangarh", "Sardarshahar", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Sujangarh", "Suratgarh", "Tonk", "Udaipur"],
    "Sikkim": ["Gangtok", "Geyzing", "Jorethang", "Mangan", "Namchi", "Nayabazar", "Rangpo", "Singtam"],
    "Tamil Nadu": ["Alandur", "Ambur", "Arakkonam", "Arcot", "Avadi", "Chennai", "Chidambaram", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Gobichettipalayam", "Gudiyatham", "Hosur", "Kancheepuram", "Karaikudi", "Karur", "Kumbakonam", "Madurai", "Nagapattinam", "Nagercoil", "Namakkal", "Neyveli", "Ooty", "Pallavaram", "Panihati", "Paramakudi", "Pollachi", "Pudukkottai", "Rajapalayam", "Ramanathapuram", "Salem", "Sivakasi", "Tambaram", "Thanjavur", "Theni Allinagaram", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvannamalai", "Vellore", "Viluppuram", "Virudhunagar"],
    "Telangana": ["Adilabad", "Bellampalle", "Bhadrachalam", "Bhongir", "Bodhan", "Gadwal", "Hyderabad", "Jagtial", "Jangaon", "Kamareddy", "Karimnagar", "Khammam", "Koratla", "Kothagudem", "Kottagudem", "Mahbubnagar", "Mancherial", "Mandamarri", "Manuguru", "Miryalaguda", "Nalgonda", "Nirmal", "Nizamabad", "Palwancha", "Ramagundam", "Sangareddy", "Sircilla", "Suryapet", "Tandur", "Vikarabad", "Wanaparthy", "Warangal", "Yellandu", "Zahirabad"],
    "Tripura": ["Agartala", "Ambassa", "Belonia", "Dharmanagar", "Kailasahar", "Khowai", "Kumarghat", "Ranirbazar", "Santirbazar", "Teliamura", "Udaipur"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Amroha", "Ayodhya", "Azamgarh", "Bahraich", "Ballia", "Banda", "Barabanki", "Bareilly", "Basti", "Bijnor", "Budaun", "Bulandshahr", "Chandausi", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hapur", "Hardoi", "Hathras", "Jaunpur", "Jhansi", "Kanpur", "Kasganj", "Khushinagar", "Lakhimpur", "Lalitpur", "Lucknow", "Mainpuri", "Mathura", "Maunath Bhanjan", "Meerut", "Mirzapur", "Modinagar", "Moradabad", "Muzaffarnagar", "Noida", "Orai", "Pilibhit", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Shahjahanpur", "Shamli", "Shikohabad", "Sitapur", "Sultanpur", "Unnao", "Varanasi"],
    "Uttarakhand": ["Almora", "Bageshwar", "Dehradun", "Haldwani", "Haridwar", "Kashipur", "Kotdwar", "Manglaur", "Mussoorie", "Nainital", "Pauri", "Pithoragarh", "Ramnagar", "Rishikesh", "Roorkee", "Rudrapur", "Srinagar", "Tehri", "Uttarkashi"],
    "West Bengal": ["Alipurduar", "Arambag", "Asansol", "Baharampur", "Bally", "Balurghat", "Bankura", "Barasat", "Bardhaman", "Barasat", "Barrackpore", "Basirhat", "Bhatpara", "Bidhannagar", "Bongaon", "Burnpur", "Cooch Behar", "Darjeeling", "Durgapur", "English Bazar", "Haldia", "Howrah", "Hugli-Chinsurah", "Jalpaiguri", "Kalyani", "Kamarhati", "Kanchrapara", "Kharagpur", "Kolkata", "Krishnanagar", "Madhyamgram", "Malda", "Medinipur", "Nabadwip", "Naihati", "North Barrackpore", "North Dumdum", "Panihati", "Purulia", "Raiganj", "Rajarhat", "Ranaghat", "Rishra", "Santipur", "Serampore", "Siliguri", "South Dumdum", "Titagarh", "Uluberia"],
    "Delhi": ["Adarsh Nagar", "Alipur", "Anand Vihar", "Ashok Vihar", "Badarpur", "Bawana", "Chanakyapuri", "Chandni Chowk", "Chhatarpur", "Civil Lines", "Connaught Place", "Daryaganj", "Defence Colony", "Delhi Cantonment", "Dwarka", "East of Kailash", "Gandhi Nagar", "Geeta Colony", "Greater Kailash", "Green Park", "Hauz Khas", "Inderlok", "Janakpuri", "Jangpura", "Kalkaji", "Karol Bagh", "Kashmere Gate", "Khan Market", "Kirti Nagar", "Lajpat Nagar", "Laxmi Nagar", "Lodhi Colony", "Malviya Nagar", "Mayur Vihar", "Mehrauli", "Model Town", "Moti Nagar", "Mukherjee Nagar", "Najafgarh", "Narela", "Nehru Place", "New Friends Colony", "Okhla", "Paharganj", "Palam", "Paschim Vihar", "Patel Nagar", "Pitampura", "Preet Vihar", "Punjabi Bagh", "R.K. Puram", "Rajendra Nagar", "Rajouri Garden", "Rohini", "Saket", "Sarita Vihar", "Sarojini Nagar", "Shahdara", "Shalimar Bagh", "South Extension", "Tilak Nagar", "Vasant Kunj", "Vasant Vihar", "Vikaspuri"],
    "Jammu and Kashmir": ["Anantnag", "Baramulla", "Jammu", "Kathua", "Pulwama", "Sopore", "Srinagar", "Udhampur"],
    "Ladakh": ["Kargil", "Leh"],
    "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam", "Ozhukarai"]
};

const INDIAN_STATES = Object.keys(STATE_CITY_MAP).sort();

export default function KYCPage() {
    const router = useRouter();
    const totals = useSelector(selectCartTotals);
    const { securityAmount, deliveryCharges, monthlyRentTotal, totalGST, totalOneTime, payToday, savedAmount, couponDiscount, couponCode } = totals;

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Refs for file uploads
    const identityProofRef = useRef(null);
    const addressProofRef = useRef(null);
    const bankStatementRef = useRef(null);

    // Form data state
    const [formData, setFormData] = useState({
        personal: { name: '', fatherName: '', fatherPhone: '', email: '', phone: '', residenceStatus: '', address: '', state: '', city: '', pincode: '' },
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
        const { name, fatherName, fatherPhone, email, phone, residenceStatus, address, state, city, pincode } = formData.personal;
        let newErrors = {};
        if (!name) newErrors.name = 'Required';
        if (!fatherName) newErrors.fatherName = 'Required';
        if (!fatherPhone) newErrors.fatherPhone = 'Required';
        if (!email) newErrors.email = 'Required';
        if (!phone) newErrors.phone = 'Required';
        if (!residenceStatus) newErrors.residenceStatus = 'Required';
        if (!address) newErrors.address = 'Required';
        if (!state) newErrors.state = 'Required';
        if (!city) newErrors.city = 'Required';
        if (!pincode) newErrors.pincode = 'Required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const { name, relation, phone, address, state, city, pincode } = formData.reference;
        let newErrors = {};
        if (!name) newErrors.name = 'Required';
        if (!relation) newErrors.relation = 'Required';
        if (!phone) newErrors.phone = 'Required';
        if (!address) newErrors.address = 'Required';
        if (!state) newErrors.state = 'Required';
        if (!city) newErrors.city = 'Required';
        if (!pincode) newErrors.pincode = 'Required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            if (!validateStep1()) return;
        }
        if (currentStep === 2) {
            if (!validateStep2()) return;
        }
        if (currentStep === 3) {
            const missingDocs = [];
            if (!identityProofRef.current?.files?.[0]) missingDocs.push('Identity Proof');
            if (!addressProofRef.current?.files?.[0]) missingDocs.push('Address Proof');
            if (!bankStatementRef.current?.files?.[0]) missingDocs.push('Bank Statement');
            if (missingDocs.length > 0) {
                Swal.fire({ icon: 'warning', title: 'Documents Required', text: `Please attach: ${missingDocs.join(', ')}.` });
                return;
            }
            if (!isDocumentsChecked) {
                Swal.fire({ icon: 'warning', title: 'Action Required', text: 'Please check the confirmation box.' });
                return;
            }

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
                    personalDetails: { ...formData.personal, idType: formData.documents.identityProof },
                    referenceDetails: formData.reference,
                    documents: { ...uploadedDocs, identityProofType: formData.documents.identityProof, addressProofType: formData.documents.addressProof }
                });

                router.push('/checkout/payment');
            } catch (error) {
                console.error(error);
                Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to submit KYC.' });
            } finally {
                setLoading(false);
            }
            return;
        }

        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    return (
        <div
            className="min-h-screen font-sans"
            style={{
                background: 'var(--color-grey-grey-50, hsla(0, 0%, 96%, 1))',
                width: '100%',
                paddingTop: '48px',
                paddingBottom: '48px',
                opacity: 1
            }}
        >
            <div className="max-w-[1200px] mx-auto px-5 md:px-8">
                {/* Breadcrumb */}
                {currentStep !== 4 && (
                    <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
                        <Link href="/" className="hover:text-black font-medium">Product-Page</Link>
                        <span>›</span>
                        <Link href="/cart" className="hover:text-black font-medium">Cart</Link>
                        <span>›</span>
                        <Link href="/checkout/address" className="hover:text-black font-medium">Address</Link>
                        <span>›</span>
                        <span className="text-black font-bold">Verification</span>
                    </div>
                )}

                {currentStep === 4 ? (
                    <div className="flex justify-center items-start min-h-[60vh] py-4">
                        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 md:px-10 md:py-12">
                            {/* Back */}
                            <button
                                onClick={() => router.push('/')}
                                className="inline-flex items-center gap-1 border border-[#FE5B47] text-[#FE5B47] text-sm font-medium pl-2 pr-4 py-1.5 rounded-full hover:bg-[#FE5B47]/5 transition-colors mb-6"
                            >
                                <PiCaretLeftBold size={14} /> Back
                            </button>

                            {/* Illustration */}
                            <div className="relative w-[220px] max-w-full aspect-square mx-auto mb-6">
                                <Image src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780663926/dd1c2084f2fcb139d03760ae3129fe37c22c3085_uorqis.png" alt="KYC in progress" fill className="object-contain" priority />
                            </div>

                            <div className="text-center">
                                <h2 className="text-[28px] md:text-4xl font-bold text-[#1877F2] mb-3">KYC in Progress</h2>
                                <p className="text-gray-800 text-[14px] md:text-[15px] font-medium mb-8 max-w-md mx-auto leading-relaxed">
                                    We are now reviewing your documents. This typically takes 24-48 hours. We will notify you via email as soon its complete.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Link href="/profile/orders" className="bg-[#1877F2] hover:bg-[#1465d8] text-white font-medium py-3 rounded-full transition-colors text-center shadow-sm">
                                        Go To My Orders
                                    </Link>
                                    <Link href="/profile/kyc" className="border border-gray-300 text-gray-800 font-medium py-3 rounded-full transition-colors text-center hover:bg-gray-50">
                                        KYC Documentation
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className="flex flex-row items-start max-lg:!flex-col max-lg:!w-full"
                        style={{
                            width: '1200px',
                            gap: '32px',
                            opacity: 1
                        }}
                    >
                        {/* Left Column: KYC Verification Form */}
                        <div
                            className="flex flex-col max-lg:!w-full"
                            style={{
                                width: '726px',
                                gap: '20px'
                            }}
                        >
                            <div
                                className="flex flex-col max-lg:!w-full max-lg:!h-auto"
                                style={{
                                    width: '726px',
                                    height: '35px',
                                    gap: '12px'
                                }}
                            >
                                <div
                                    className="flex flex-col max-lg:!w-full"
                                    style={{
                                        width: '372px',
                                        height: '35px',
                                        gap: '12px'
                                    }}
                                >
                                    <h1
                                        className="max-lg:!w-full"
                                        style={{
                                            width: '372px',
                                            height: '35px',
                                            fontFamily: 'Mona Sans, sans-serif',
                                            fontWeight: '600',
                                            fontSize: '27px', // font/size/6
                                            letterSpacing: '-0.8px',
                                            lineHeight: '35px',
                                            color: '#333333',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        KYC & Documentation
                                    </h1>
                                </div>
                            </div>

                            <div className="bg-[#e8ffe4] border border-[#5bff53] rounded-[8px] flex items-start gap-[10px] px-[18px] py-[12px]">
                                <FaFingerprint size={16.67} className="text-[#0c5b11] shrink-0" />
                                <span className="text-[#0c5b11] font-semibold text-[14px] tracking-[-0.4px] leading-[20px]">Complete KYC to complete your order</span>
                            </div>

                            <div
                                className="flex flex-col max-lg:!w-full max-lg:!h-auto"
                                style={{
                                    width: '726px',
                                    height: '112px',
                                    borderRadius: '12px',
                                    padding: '12px 18px',
                                    background: '#fffaec',
                                    border: '1px solid #ff920a',
                                    gap: '10px'
                                }}
                            >
                                <h3
                                    style={{
                                        width: '350px',
                                        height: '20px',
                                        fontFamily: 'Mona Sans, sans-serif',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        color: 'hsla(0, 0%, 33%, 1)',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    Keep your documents handy (physical or digital)
                                </h3>
                                <ol
                                    className="list-decimal"
                                    style={{
                                        width: '232px',
                                        height: '58px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '5px',
                                        paddingLeft: '18px'
                                    }}
                                >
                                    {[
                                        'Aadhar Card / Voter ID / Passport',
                                        'Rental Agreement / House Electricity Bill',
                                        'Bank Statement → 3 Months'
                                    ].map((text, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                width: '232px',
                                                height: '16px',
                                                fontFamily: 'Mona Sans, sans-serif',
                                                fontWeight: '500',
                                                fontSize: '12px',
                                                color: 'hsla(0, 0%, 33%, 1)',
                                                display: 'list-item'
                                            }}
                                        >
                                            {text}
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div
                                className="max-lg:!w-full"
                                style={{
                                    width: '726px',
                                    height: '0px',
                                    borderTop: '1px solid hsla(0, 0%, 69%, 1)'
                                }}
                            />

                            <div
                                className="bg-white flex flex-col max-lg:!w-full max-lg:!h-auto"
                                style={{
                                    width: '726px',
                                    borderRadius: '12px',
                                    border: '2px solid #eeeeee',
                                    padding: '20px',
                                    gap: '21px',
                                    boxShadow: '0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)',
                                    background: 'hsla(0, 0%, 100%, 1)'
                                }}
                            >
                                <div
                                    className="flex flex-col max-lg:!w-full"
                                    style={{
                                        width: '686px',
                                        gap: '21px'
                                    }}
                                >
                                    {/* Progress Stepper */}
                                    <div
                                        className="flex items-center justify-center bg-white max-lg:!w-full"
                                        style={{
                                            width: '686px',
                                            height: '72px',
                                            padding: '20px 0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {[1, 2, 3].map((step) => (
                                            <React.Fragment key={step}>
                                                <div
                                                    className={`rounded-full flex items-center justify-center border transition-all`}
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '72px',
                                                        border: currentStep >= step ? '1px solid #1D1D1F' : '1px solid hsla(0, 0%, 46%, 1)',
                                                        background: currentStep >= step ? '#1D1D1F' : '#FFFFFF',
                                                        color: currentStep >= step ? '#FFFFFF' : 'hsla(0, 0%, 46%, 1)'
                                                    }}
                                                >
                                                    {currentStep > step ? <PiCheckCircleFill size={20} /> : <span className="font-semibold text-[14px]">{step}</span>}
                                                </div>
                                                {step < 3 && <div className={`w-8 md:w-20 h-0.5 transition-all ${currentStep > step ? 'bg-[#1D1D1F]' : 'bg-gray-300'}`} />}
                                            </React.Fragment>
                                        ))}
                                    </div>


                                    {/* Step 1: Personal Details */}
                                    {currentStep === 1 && (
                                        <div
                                            className="flex flex-col pr-2"
                                            style={{
                                                width: '100%',
                                            }}
                                        >
                                            <h2
                                                className="max-lg:!w-full"
                                                style={{
                                                    width: '686px',
                                                    height: '36px',
                                                    fontFamily: 'Mona Sans, sans-serif',
                                                    fontWeight: '600',
                                                    fontSize: '21px',
                                                    letterSpacing: '-0.8px',
                                                    color: '#333333',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    paddingBottom: '8px',
                                                    marginBottom: '12px',
                                                    borderBottom: '1px solid hsla(0, 0%, 93%, 1)',
                                                    gap: '8px'
                                                }}
                                            >
                                                Personal Details
                                            </h2>
                                            <div className="flex flex-col gap-[12px]">
                                                <TextInput label="Name" required error={errors.name} placeholder="Enter Your Full Name" value={formData.personal.name} onChange={(e) => handleTextChange('personal', 'name', e.target.value)} />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                                                    <TextInput label="Personal Email" required error={errors.email} placeholder="Placeholder" value={formData.personal.email} onChange={(e) => handleTextChange('personal', 'email', e.target.value)} />
                                                    <TextInput label="Mobile Number" required error={errors.phone} placeholder="Placeholder" value={formData.personal.phone} onChange={(e) => handleTextChange('personal', 'phone', e.target.value)} />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                                                    <TextInput label="Father's Name" required error={errors.fatherName} placeholder="Placeholder" value={formData.personal.fatherName} onChange={(e) => handleTextChange('personal', 'fatherName', e.target.value)} />
                                                    <TextInput label="Father's Number" required error={errors.fatherPhone} placeholder="Placeholder" value={formData.personal.fatherPhone} onChange={(e) => handleTextChange('personal', 'fatherPhone', e.target.value)} />
                                                </div>
                                                <TextInput label="Residence Status" required isSelect options={['Owned', 'Rented', 'Company Provided', 'Family Owned', 'Other']} error={errors.residenceStatus} placeholder="Select" value={formData.personal.residenceStatus} onChange={(e) => handleTextChange('personal', 'residenceStatus', e.target.value)} />
                                                <TextInput label="Residence Address" required error={errors.address} placeholder="Placeholder" value={formData.personal.address} onChange={(e) => handleTextChange('personal', 'address', e.target.value)} />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                                                    <TextInput label="City" required error={errors.city} placeholder="Placeholder" value={formData.personal.city} onChange={(e) => handleCityChange('personal', e.target.value)} />
                                                    <TextInput label="State" required isSelect options={INDIAN_STATES} error={errors.state} value={formData.personal.state} onChange={(e) => handleStateChange('personal', e.target.value)} />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                                                    <TextInput label="Pincode" required error={errors.pincode} placeholder="Placeholder" value={formData.personal.pincode} onChange={(e) => handlePincodeChange('personal', e.target.value)} />
                                                    <TextInput label="Country" required value="India" readOnly />
                                                </div>
                                                <button
                                                    onClick={handleNext}
                                                    className="mt-4 transition-colors flex items-center justify-center shrink-0 mb-6"
                                                    style={{
                                                        width: '100%',
                                                        height: '35px',
                                                        borderRadius: '9999px',
                                                        background: 'hsla(44, 100%, 64%, 1)',
                                                        padding: '6px 20px',
                                                        border: 'none'
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            width: '200px',
                                                            height: '23px',
                                                            fontFamily: 'Mona Sans, sans-serif',
                                                            fontWeight: '500',
                                                            fontSize: '16px',
                                                            color: 'hsla(0, 0%, 12%, 1)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            lineHeight: '23px',
                                                            letterSpacing: '0px'
                                                        }}
                                                    >
                                                        Start my KYC process
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Reference Only */}
                                    {currentStep === 2 && (
                                        <div className="flex flex-col pr-2" style={{ width: '100%' }}>
                                            <h2
                                                className="max-lg:!w-full"
                                                style={{
                                                    width: '686px', height: '36px', fontFamily: 'Mona Sans, sans-serif',
                                                    fontWeight: '600', fontSize: '21px', letterSpacing: '-0.8px', color: '#333333',
                                                    display: 'flex', alignItems: 'center', paddingBottom: '8px',
                                                    marginBottom: '12px', borderBottom: '1px solid hsla(0, 0%, 93%, 1)', gap: '8px'
                                                }}
                                            >
                                                Reference Only
                                            </h2>
                                            <div className="flex flex-col gap-[12px]">
                                                <TextInput label="Reference Name" required error={errors.name} placeholder="Placeholder" value={formData.reference.name} onChange={(e) => handleTextChange('reference', 'name', e.target.value)} />
                                                <TextInput label="Relation of the person" required isSelect options={['Father', 'Mother', 'Brother', 'Sister', 'Friend', 'Colleague', 'Other']} error={errors.relation} placeholder="Placeholder" value={formData.reference.relation} onChange={(e) => handleTextChange('reference', 'relation', e.target.value)} />
                                                <TextInput label="Mobile No." required error={errors.phone} placeholder="Placeholder" value={formData.reference.phone} onChange={(e) => handleTextChange('reference', 'phone', e.target.value)} />
                                                <TextInput label="Reference Address" required error={errors.address} placeholder="Placeholder" value={formData.reference.address} onChange={(e) => handleTextChange('reference', 'address', e.target.value)} />
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                                                    <TextInput label="City" required error={errors.city} placeholder="Placeholder" value={formData.reference.city} onChange={(e) => handleCityChange('reference', e.target.value)} />
                                                    <TextInput label="State" required isSelect options={INDIAN_STATES} error={errors.state} value={formData.reference.state} onChange={(e) => handleStateChange('reference', e.target.value)} />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                                                    <TextInput label="Pincode" required error={errors.pincode} placeholder="Placeholder" value={formData.reference.pincode} onChange={(e) => handlePincodeChange('reference', e.target.value)} />
                                                    <TextInput label="Country" required value="India" readOnly />
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-[21px] mt-4 mb-6">
                                                    <button
                                                        onClick={handleBack}
                                                        className="transition-colors flex items-center justify-center"
                                                        style={{
                                                            width: '100%', height: '35px', borderRadius: '9999px',
                                                            background: '#FFFFFF', border: '1px solid #1D1D1F',
                                                            color: '#1D1D1F', fontWeight: '500', fontSize: '16px'
                                                        }}
                                                    >
                                                        Back
                                                    </button>
                                                    <button
                                                        onClick={handleNext}
                                                        className="transition-colors flex items-center justify-center"
                                                        style={{
                                                            width: '100%', height: '35px', borderRadius: '9999px',
                                                            background: 'hsla(44, 100%, 64%, 1)', border: 'none',
                                                            color: 'hsla(0, 0%, 12%, 1)', fontWeight: '500', fontSize: '16px'
                                                        }}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Documents Upload */}
                                    {currentStep === 3 && (
                                        <div className="flex flex-col pr-2" style={{ width: '100%' }}>
                                            <h2
                                                className="max-lg:!w-full"
                                                style={{
                                                    width: '686px', height: '36px', fontFamily: 'Mona Sans, sans-serif',
                                                    fontWeight: '600', fontSize: '21px', letterSpacing: '-0.8px', color: '#333333',
                                                    display: 'flex', alignItems: 'center', paddingBottom: '8px',
                                                    marginBottom: '12px', borderBottom: '1px solid hsla(0, 0%, 93%, 1)', gap: '8px'
                                                }}
                                            >
                                                Documents Upload
                                            </h2>
                                            <div className="flex flex-col gap-[12px]">
                                                {/* Identity Proof */}
                                                <div className="flex flex-col gap-2">
                                                    <TextInput
                                                        label="Identity Proof" required isSelect
                                                        options={['Aadhar Card', 'Voter ID', 'Passport']} 
                                                        value={formData.documents.identityProof} 
                                                        onChange={(e) => handleTextChange('documents', 'identityProof', e.target.value)} 
                                                    />
                                                    <div className="flex flex-col gap-1 mt-1">
                                                        <label className="font-semibold text-xs text-gray-800">{formData.documents.identityProof || 'Identity Proof'} Card <span className="text-red-500">*</span></label>
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => identityProofRef.current?.click()} className="flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-[#0B5ED7] bg-white hover:bg-gray-50 transition-colors w-fit">
                                                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M8 11.3333V3.33333M8 3.33333L4.66667 6.66667M8 3.33333L11.3333 6.66667M3.33333 14H12.6667" stroke="#0B5ED7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                                Attach File
                                                            </button>
                                                            <span className="text-xs text-green-600 font-medium truncate w-48">{identityProofRef.current?.files?.[0]?.name || ''}</span>
                                                            <input type="file" className="hidden" ref={identityProofRef} onChange={() => setFormData({...formData})} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr className="border-t border-gray-100 my-2" />

                                                {/* Address Proof */}
                                                <div className="flex flex-col gap-2">
                                                    <TextInput 
                                                        label="Address Proof" required isSelect 
                                                        options={['House Electricity Bill', 'Rental Agreement', 'Aadhar Card']} 
                                                        value={formData.documents.addressProof} 
                                                        onChange={(e) => handleTextChange('documents', 'addressProof', e.target.value)} 
                                                    />
                                                    <div className="flex flex-col gap-1 mt-1">
                                                        <label className="font-semibold text-xs text-gray-800">{formData.documents.addressProof || 'Address Proof'} <span className="text-red-500">*</span></label>
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => addressProofRef.current?.click()} className="flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-[#0B5ED7] bg-white hover:bg-gray-50 transition-colors w-fit">
                                                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M8 11.3333V3.33333M8 3.33333L4.66667 6.66667M8 3.33333L11.3333 6.66667M3.33333 14H12.6667" stroke="#0B5ED7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                                Attach File
                                                            </button>
                                                            <span className="text-xs text-green-600 font-medium truncate w-48">{addressProofRef.current?.files?.[0]?.name || ''}</span>
                                                            <input type="file" className="hidden" ref={addressProofRef} onChange={() => setFormData({...formData})} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr className="border-t border-gray-100 my-2" />

                                                {/* Bank Statement */}
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-1 mt-1">
                                                        <label className="font-semibold text-xs text-gray-800">Bank Statement - 3 Months <span className="text-red-500">*</span></label>
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => bankStatementRef.current?.click()} className="flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-[#0B5ED7] bg-white hover:bg-gray-50 transition-colors w-fit">
                                                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M8 11.3333V3.33333M8 3.33333L4.66667 6.66667M8 3.33333L11.3333 6.66667M3.33333 14H12.6667" stroke="#0B5ED7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                                Attach File
                                                            </button>
                                                            <span className="text-xs text-green-600 font-medium truncate w-48">{bankStatementRef.current?.files?.[0]?.name || ''}</span>
                                                            <input type="file" className="hidden" ref={bankStatementRef} onChange={() => setFormData({...formData})} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div 
                                                    className="flex items-start bg-white max-lg:!w-full"
                                                    style={{
                                                        width: '560px',
                                                        height: '48px',
                                                        gap: '14px',
                                                        opacity: 1,
                                                        marginTop: '24px'
                                                    }}
                                                >
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isDocumentsChecked}
                                                        onChange={(e) => setIsDocumentsChecked(e.target.checked)}
                                                        className="mt-[2px] shrink-0"
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            borderRadius: '4px',
                                                            border: '1px solid hsla(0, 0%, 69%, 1)'
                                                        }}
                                                    />
                                                    <p
                                                        className="max-lg:!w-full"
                                                        style={{
                                                            width: '532px',
                                                            height: '48px',
                                                            fontFamily: 'Mona Sans, sans-serif',
                                                            fontWeight: '600',
                                                            fontSize: '12px',
                                                            color: 'hsla(0, 0%, 46%, 1)',
                                                            textAlign: 'justify',
                                                            lineHeight: '16px',
                                                            letterSpacing: '0px'
                                                        }}
                                                    >
                                                        By checking this box, I acknowledge that I have read and accepted the “Privacy Policy”, and I consent to the use of my provided documents and data for the sole purpose of identity verification and rental agreement processing.
                                                    </p>
                                                </div>
                                                
                                                <div className="mt-[10px] w-full">
                                                    <button
                                                        onClick={handleNext}
                                                        disabled={loading}
                                                        className="transition-colors flex items-center justify-center disabled:opacity-70"
                                                        style={{
                                                            width: '100%', height: '48px', borderRadius: '9999px',
                                                            background: 'hsla(44, 100%, 64%, 1)', border: 'none',
                                                            color: 'hsla(0, 0%, 12%, 1)', fontWeight: '500', fontSize: '16px'
                                                        }}
                                                    >
                                                        {loading ? 'Uploading...' : 'Continue to payment'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="w-full lg:w-[402px] shrink-0">
                            <OrderSummary
                                securityAmount={securityAmount}
                                deliveryCharges={deliveryCharges}
                                monthlyRentTotal={monthlyRentTotal}
                                totalGST={totalGST}
                                totalOneTime={totalOneTime}
                                payToday={payToday}
                                savedAmount={savedAmount}
                                couponDiscount={couponDiscount}
                                couponCode={couponCode}
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
    <div
        className="flex flex-col"
        style={{
            width: '100%',
            gap: '6px'
        }}
    >
        <label
            style={{
                fontFamily: 'Mona Sans, sans-serif',
                fontWeight: '600',
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '-0.4px',
                color: '#545454',
                display: 'flex',
                alignItems: 'center',
                gap: '1px'
            }}
        >
            {label} {required && <span style={{ color: '#ed2115' }}>*</span>}
        </label>
        {isSelect ? (
            <select
                className="w-full border rounded-[8px] px-2 bg-white focus:outline-none transition-all text-[12px] font-medium text-[#333] tracking-[-0.4px]"
                value={value}
                onChange={onChange}
                style={{
                    height: '39px',
                    background: 'hsla(0, 0%, 100%, 1)',
                    borderColor: error ? '#ed2115' : '#e2e2e2'
                }}
            >
                <option value="">Select</option>
                {options?.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
            </select>
        ) : (
            <input
                type="text"
                className={`w-full border rounded-[8px] px-2 transition-all text-[12px] font-medium text-[#333] tracking-[-0.4px] placeholder:text-[#afafaf] placeholder:font-medium ${readOnly ? 'bg-gray-50' : 'bg-white'} focus:outline-none`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                style={{
                    height: '39px',
                    background: 'hsla(0, 0%, 100%, 1)',
                    borderColor: error ? '#ed2115' : '#e2e2e2'
                }}
            />
        )}
        {error && (
            <p
                style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontWeight: '400',
                    fontSize: '10px',
                    lineHeight: '14px',
                    letterSpacing: '-0.4px',
                    color: '#ed2115',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {error}
            </p>
        )}
    </div>
);
