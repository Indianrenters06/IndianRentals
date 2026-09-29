import PolicyPage from '@/components/PolicyPage';
import { getPolicyMetadata } from '@/lib/policyMetadata';

export async function generateMetadata() {
    return getPolicyMetadata("privacy", "Privacy Policy", "/privacy", "Read the IndianRenters Privacy Policy to understand how we collect, use, and protect your personal information.");
}

const FALLBACK_CONTENT = `
<h2>1. Introduction & Regulatory Scope</h2>
<p>At <strong>AAA Rental LLP</strong> (operating as "Indian Renters" / "IndianRentals", "we", "us", or "our"), we place the highest priority on safeguarding your personal information and respecting your data privacy. This Privacy Policy sets forth our practices regarding the collection, storage, processing, and protection of personal data in compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Information Technology Act, 2000</strong>, and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>.</p>
<p>By browsing our website, registering an account, completing KYC verification, or entering into an equipment rental agreement with us, you consent to the collection, transfer, and processing of your personal data as described herein.</p>

<h2>2. Categories of Information We Collect</h2>
<p>To facilitate secure device rentals and comply with Indian statutory requirements, we collect the following categories of data:</p>
<ul>
  <li><strong>Direct Identification & Contact Data:</strong> Full legal name, personal and official email addresses, mobile telephone numbers, delivery addresses, and billing addresses.</li>
  <li><strong>Know Your Customer (KYC) Documentation:</strong> Permanent Account Number (PAN) card details, government identity documents (Aadhaar with UID masked as per UIDAI directives, Passport, or Voter ID), corporate GSTIN registration certificates, and company incorporation credentials for enterprise accounts.</li>
  <li><strong>Transaction & Payment Information:</strong> Payment mode references, UPI IDs, transaction tokens, and billing history. All card transactions are executed through PCI-DSS Level 1 certified payment aggregators (e.g., Razorpay, Cashfree). <em>We never store raw credit/debit card numbers, CVVs, or online banking passwords on our internal servers.</em></li>
  <li><strong>Technical & Telemetry Data:</strong> IP addresses, browser types, operating systems, session timestamps, device identifiers, and referral URLs gathered via automated cookies and server logs during your visit.</li>
</ul>

<h2>3. Purpose & Lawful Basis of Processing</h2>
<p>We process your personal information strictly for legitimate commercial, operational, and legal purposes:</p>
<ul>
  <li><strong>Rental Order Fulfillment:</strong> Processing bookings, verifying device compatibility, coordinating doorstep delivery, and managing physical return pickups.</li>
  <li><strong>Fraud Prevention & Identity Verification:</strong> Validating identity, mitigating equipment theft or unauthorized resale, and ensuring authentic commercial leasing.</li>
  <li><strong>Financial Accounting & Taxation:</strong> Generating GST-compliant tax invoices, recording payment reconciliations, and fulfilling statutory audits required under Indian tax laws.</li>
  <li><strong>Customer Care & Critical Notifications:</strong> Providing dispatch tracking, service tickets, hardware maintenance alerts, return reminders, and warranty notifications via SMS, WhatsApp, or email.</li>
</ul>

<h2>4. Non-Disclosure & Third-Party Sharing</h2>
<p><strong>We do not sell, rent, or trade your personal data to third-party marketing companies or data brokers under any circumstances.</strong></p>
<p>Information is shared solely on a restricted, need-to-know basis with vetted service partners:</p>
<ul>
  <li><strong>Logistics & Courier Providers:</strong> Verified logistics partners receive your delivery name, address, and mobile number strictly for device drop-off and pickup.</li>
  <li><strong>Payment Gateways & Banking Networks:</strong> RBI-authorized payment processors handle transactional funds in encrypted environments.</li>
  <li><strong>Statutory & Law Enforcement Authorities:</strong> When formally subpoenaed, requested by court order, or mandated by Indian judicial or regulatory enforcement authorities under applicable laws.</li>
</ul>

<h2>5. Data Privacy on Rented Devices (Sanitization Protocol)</h2>
<p>We recognize that workstations, laptops, and storage devices rented for business or personal use may hold confidential data:</p>
<ul>
  <li><strong>Customer Responsibility:</strong> You are solely responsible for logging out of all personal or corporate cloud accounts (iCloud, Google, OneDrive, Microsoft 365) and performing an initial factory reset or file backup prior to returning equipment.</li>
  <li><strong>Automated Laboratory Sanitization:</strong> Upon intake at our technical hub, every return drive undergoes an automated, certified multi-pass wipe following DoD 5220.22-M data sanitization protocols. We ensure that no previous renter's files or system histories survive on any re-deployed machine.</li>
</ul>

<h2>6. Data Security & Storage Architecture</h2>
<p>We enforce rigorous technical and organizational controls to safeguard your data against loss, unauthorized access, alteration, or disclosure:</p>
<ul>
  <li><strong>Encryption in Transit & At Rest:</strong> All web traffic is secured with TLS 1.3 encryption. Internal database records and uploaded KYC documents are stored with AES-256 encryption within ISO 27001-certified Indian data centers.</li>
  <li><strong>Strict Access Boundaries:</strong> Access to customer KYC and identity records is restricted solely to authorized compliance personnel through multi-factor authentication (MFA).</li>
</ul>

<h2>7. Data Retention & Erasure</h2>
<p>We retain personal information only for as long as necessary to fulfill the purposes for which it was gathered, or as mandated by Indian statutory accounting and taxation guidelines (typically up to 7 financial years for transaction records).</p>
<p>Subject to the clearance of all active rentals, equipment returns, and financial liabilities, you may exercise your right to request account deactivation and data erasure by writing to our compliance desk.</p>

<h2>8. Cookies & Tracking Technologies</h2>
<p>We utilize cookies and similar telemetry tools to enhance site navigation, analyze user traffic, and remember your city selection:</p>
<ul>
  <li><strong>Essential Cookies:</strong> Required for authentication, cart retention, and secure checkout sessions.</li>
  <li><strong>Consent Preferences:</strong> We remember your choice, its date, and a random reference for 180 days. Our backend stores a hashed reference so it can respect your latest choice.</li>
  <li><strong>Optional Site Analytics:</strong> Only after you accept, we count visits to public page categories and broad device categories (mobile, tablet, desktop). These records expire after 90 days and exclude contact details, form contents, full URLs, and individual browsing histories. Account and checkout pages are excluded. Change or withdraw your choice using Cookie settings in the footer.</li>
  <li><strong>Google Analytics:</strong> If configured, it runs only after optional analytics consent. Advertising features remain disabled.</li>
</ul>

<h2>9. Your Rights as a Data Principal</h2>
<p>Under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
<ul>
  <li>Request access to a summary of the personal data we hold about you.</li>
  <li>Request correction, updating, or rectification of inaccurate or outdated information.</li>
  <li>Nominate another individual to exercise your data rights in the event of incapacity.</li>
  <li>Withdraw consent for non-essential transactional communications.</li>
</ul>

<h2>10. Grievance Redressal Officer</h2>
<p>In accordance with the Information Technology Act, 2000 and the Rules made thereunder, the contact details of the designated Grievance Officer for IndianRenters are provided below:</p>
<p>
  <strong>Grievance Officer:</strong> Compliance & Legal Desk<br />
  <strong>Company:</strong> AAA Rental LLP (IndianRenters)<br />
  <strong>Email:</strong> <a href="mailto:grievance@indianrenters.com">grievance@indianrenters.com</a><br />
  <strong>Corporate Support:</strong> <a href="mailto:support@indianrenters.com">support@indianrenters.com</a><br />
  <strong>Response Window:</strong> We acknowledge all grievances within 48 hours and resolve verified queries within 30 days.
</p>
`;

export default function Page() {
    return <PolicyPage cmsKey='privacy' title={"Privacy Policy"} image={"https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770802400/ae1488b221c19db77a3c781e4313273ed5449f17_xdpggg.jpg"} fallbackHtml={FALLBACK_CONTENT} />;
}
