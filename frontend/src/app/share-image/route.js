import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE } from '@/config/site';
export const runtime = 'nodejs';
export async function GET() {
    return new ImageResponse(
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 76, background: '#141414', color: '#f6f6f6' }}>
            <div style={{ display: 'flex', fontSize: 32, color: '#ffcf46' }}>{SITE_NAME}.com</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, lineHeight: 1.12, maxWidth: 1020 }}>{SITE_TAGLINE}</div>
                <div style={{ display: 'flex', fontSize: 30, color: '#ddd' }}>Laptops · Cameras · AV · Office equipment</div>
            </div>
            <div style={{ display: 'flex', fontSize: 26, color: '#ffcf46' }}>Equipment rentals for the work ahead.</div>
        </div>,
        { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=86400' } }
    );
}
