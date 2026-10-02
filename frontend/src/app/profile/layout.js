import ProfileLayoutClient from './ProfileLayoutClient';
import { privateRobots } from '@/lib/seo.mjs';
export const metadata = { title: 'Your account', robots: privateRobots };
export default function Layout({ children }) { return <ProfileLayoutClient>{children}</ProfileLayoutClient>; }
