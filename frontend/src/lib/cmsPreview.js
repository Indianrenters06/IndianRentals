import { API } from '@/services/apiConfig';

export function cmsUrl(pageName) {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const token = params?.get('cmsPreviewPage') === pageName ? params.get('cmsPreview') : null;
    const base = `${API}/api/cms/${encodeURIComponent(pageName)}`;
    return token
        ? `${base}/preview?token=${encodeURIComponent(token)}`
        : base;
}

export async function loadCmsPage(pageName, previewToken) {
    // Metadata and server-rendered pages need an absolute URL; browser requests
    // use the storefront's shared same-origin API path in local development.
    const serverApi = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://indianrentals-3ugl.onrender.com';
    const base = `${typeof window === 'undefined' ? serverApi : API}/api/cms/${encodeURIComponent(pageName)}`;
    const url = previewToken
        ? `${base}/preview?token=${encodeURIComponent(previewToken)}`
        : base;
    try {
        const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
        if (!response.ok) return previewToken ? null : {};
        return response.json();
    } catch {
        return previewToken ? null : {};
    }
}
