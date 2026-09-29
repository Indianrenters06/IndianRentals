import { SITE_NAME, SITE_URL } from '@/config/site';
import { loadCmsPage } from '@/lib/cmsPreview';

export async function getCmsMetadata(cmsKey, pageTitle, canonicalPath, fallbackDescription, previewToken) {
    const cms = await loadCmsPage(cmsKey, previewToken) || {};

    return {
        title: { absolute: cms.metaTitle || `${pageTitle} | ${SITE_NAME}` },
        description: cms.metaDescription || fallbackDescription || `Read the ${pageTitle} for IndianRenters rentals.`,
        alternates: { canonical: `${SITE_URL}${canonicalPath}` },
        ...(previewToken ? { robots: { index: false, follow: false } } : {}),
    };
}

export const getPolicyMetadata = getCmsMetadata;
