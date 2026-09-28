import PolicyPage from '@/components/PolicyPage';

const FALLBACK = `<h2>KYC Verification Policy</h2>
<p>To ensure a secure and trusted rental experience, all customers are required to complete a one-time KYC (Know Your Customer) verification process.</p>
<h3>Required Documents</h3>
<ul>
  <li><strong>Identity Proof:</strong> Valid PAN Card (Mandatory).</li>
  <li><strong>Address Proof:</strong> Aadhaar Card, Passport, or Voter ID.</li>
  <li><strong>Additional Info:</strong> For corporate rentals, GST certificate and authorized signatory documents are required.</li>
</ul>
<h3>Verification Process</h3>
<p>Once you upload your documents, our team will verify them within 2–4 business hours. You will receive an email/SMS notification once your KYC is approved.</p>
<h3>Data Security</h3>
<p>Your documents are stored securely and encrypted. We do not share your KYC data with any third parties except as required by law.</p>`;

export default function Page() {
    return <PolicyPage cmsKey='kyc-policy' title={'KYC Verification Policy'} image={'https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770802400/ae1488b221c19db77a3c781e4313273ed5449f17_xdpggg.jpg'} fallbackHtml={FALLBACK} />;
}
