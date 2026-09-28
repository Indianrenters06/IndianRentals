// Illustration IDs match the rentalProcessSteps.illustration CMS field.
const illustrations = [
    { id: 'choose-your-tech', label: 'Choose your tech', icons: ['Laptop', 'FaSearch', 'FaLaptopCode'] },
    { id: 'complete-kyc', label: 'Complete KYC', icons: ['IdentificationCard', 'UserFocus', 'FaIdCard', 'FaUserCheck'] },
    { id: 'secure-your-order', label: 'Secure your order', icons: ['ShoppingCart', 'FaCreditCard', 'FaShieldAlt'] },
    { id: 'receive-and-create', label: 'Receive and create', icons: ['Package', 'FaTruck', 'FaBoxOpen'] },
];

function getStepIllustration(step) {
    const choice = step.illustration || 'auto';
    if (choice === 'none') return '';
    const selected = illustrations.find(item => choice === 'auto'
        ? item.icons.includes(step.icon)
        : item.id === choice);
    return selected ? `/images/rental-process/${selected.id}-line-art.webp` : '';
}

export { illustrations, getStepIllustration };
