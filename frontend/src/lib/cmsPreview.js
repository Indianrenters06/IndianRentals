const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function cmsUrl(pageName) {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const token = params?.get('cmsPreviewPage') === pageName ? params.get('cmsPreview') : null;
    const base = `${API}/api/cms/${encodeURIComponent(pageName)}`;
    return token
        ? `${base}/preview?token=${encodeURIComponent(token)}`
        : base;
}

export async function loadCmsPage(pageName, previewToken) {
    const base = `${API}/api/cms/${encodeURIComponent(pageName)}`;
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
