import PolicyPage from '@/components/PolicyPage';

const FALLBACK = `
<h2>1. Cancellation Prior to Dispatch</h2>
<p>We understand that project requirements and schedules can change. You may cancel your rental order at any time before dispatch:</p>
<ul>
  <li><strong>100% Full Refund:</strong> If you cancel your order prior to device packaging and logistics dispatch confirmation, you will receive a 100% refund of all advance rental payments and security deposits.</li>
  <li><strong>Turnaround Time:</strong> Pre-dispatch refunds are initiated within 24 hours of cancellation and credited to your original payment method (Bank Account / UPI / Card) within 3–5 business days.</li>
</ul>

<h2>2. Doorstep Inspection & Instant Replacement</h2>
<p>Every product dispatched by IndianRenters is benchmarked, tested, and sealed. However, to guarantee total satisfaction:</p>
<ul>
  <li><strong>Doorstep Quality Check:</strong> You have the right to inspect the cosmetic condition and power-on functionality of the device upon arrival with our delivery representative.</li>
  <li><strong>Transit Damage or Spec Discrepancy:</strong> If you identify any cosmetic crack, transit damage, or specification mismatch, you may reject the delivery immediately with zero financial liability.</li>
  <li><strong>Priority Swap:</strong> Our logistics hub will dispatch a replacement unit within 24–48 business hours at no extra cost, or issue a 100% refund if you choose to cancel.</li>
</ul>

<h2>3. Early Rental Termination (Mid-Tenure Returns)</h2>
<p>We offer industry-leading flexibility for changing enterprise and freelance demands:</p>
<ul>
  <li><strong>Notice Period:</strong> If you wish to return a device prior to the expiration of your booked rental tenure, please notify us at least 5 business days in advance via your dashboard or customer support.</li>
  <li><strong>Slab Recalculation:</strong> Rental fees for the period utilized will be adjusted retroactively according to the actual tenure slab completed (for example, if a 6-month rental is terminated at month 2, rental is calculated at the prevailing 2-month monthly rate).</li>
  <li><strong>Balance Refund:</strong> Any surplus advance rental paid will be credited back to your account alongside your security deposit.</li>
</ul>

<h2>4. Security Deposit Refund Protocol</h2>
<p>We believe in transparent, frictionless deposit refunds:</p>
<ul>
  <li><strong>Step 1 — Return Pickup:</strong> Our logistics associate collects the device from your registered address and issues a digital pickup acknowledgment.</li>
  <li><strong>Step 2 — Lab Quality Check (QC):</strong> Within 24–48 hours of arriving at our central service depot, certified technicians inspect hardware integrity, display status, ports, and accessories.</li>
  <li><strong>Step 3 — Settlement & Release:</strong> Once QC is cleared and any outstanding rental fees are settled, the full security deposit is automatically released to your original source account or verified bank account within 5–7 business days.</li>
</ul>

<h2>5. Damage Deductions & Assessment Guidelines</h2>
<p>We distinguish strictly between normal wear and tear and accidental damage:</p>
<ul>
  <li><strong>Normal Wear & Tear (Zero Deduction):</strong> Minor faint surface scuffs from everyday handling, natural battery degradation through ordinary charging cycles, and keyboard keycap shine are considered normal wear and tear and are <strong>never penalized</strong>.</li>
  <li><strong>Assessed Physical Damages:</strong> Broken or cracked display panels, bent or dented chassis caused by drops, missing keys, burnt ports from unstable electrical circuits, motherboard liquid exposure, and missing power adapters/cables will be assessed at actual OEM component repair/replacement cost.</li>
  <li><strong>Fair Transparency:</strong> In any damage scenario, our team provides high-resolution photographic proof and an itemized repair estimate before any deduction from your security deposit is made.</li>
</ul>

<h2>6. Renter Return Checklist</h2>
<p>To ensure prompt processing and avoid deposit delays, please ensure the following before pickup:</p>
<ul>
  <li>Back up all personal, confidential, and corporate data.</li>
  <li>Log out of Apple ID / iCloud, Google Accounts, Microsoft Office, and Adobe Creative Cloud.</li>
  <li>Disable Windows BitLocker, Apple "Find My", and any BIOS administrator passwords.</li>
  <li>Hand over all original accessories including charger, power cable, adapter, and protective sleeve.</li>
</ul>
`;

export default function Page() {
    return <PolicyPage cmsKey='refund' title={'Return, Cancellation & Refund Policy'} image={'https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770802400/ae1488b221c19db77a3c781e4313273ed5449f17_xdpggg.jpg'} fallbackHtml={FALLBACK} />;
}
