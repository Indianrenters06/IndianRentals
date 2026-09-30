import HomepageDemoClient from './HomepageDemoClient';

export const metadata = {
  title: 'Homepage concept preview',
  description: 'A private preview of a clearer IndianRenters homepage.',
  robots: { index: false, follow: false },
};

export default function HomepageDemoPage() {
  return <HomepageDemoClient />;
}
