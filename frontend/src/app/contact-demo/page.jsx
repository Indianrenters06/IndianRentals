import Link from 'next/link';
import LegacyContactPage from './LegacyContactPage';
export default function ContactBackup() { return <><div className="bg-yellow-50 px-5 py-3 text-sm flex justify-between gap-4"><span>Original contact page · saved design backup</span><Link className="underline" href="/contact">Go to current contact page</Link></div><LegacyContactPage /></>; }
