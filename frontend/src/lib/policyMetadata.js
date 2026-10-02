import { publicMetadata } from '@/lib/publicMetadata';
import { privateRobots } from '@/lib/seo.mjs';
import { loadCmsPage } from '@/lib/cmsPreview';

export async function getCmsMetadata(cmsKey, pageTitle, canonicalPath, fallbackDescription, previewToken) {
    const cms = await loadCmsPage(cmsKey, previewToken) || {};

    return {
        ...publicMetadata({ title: cms.metaTitle || pageTitle,
            description: cms.metaDescription || fallbackDescription || `Read the ${pageTitle} for IndianRenters rentals.`,
            path: canonicalPath }),
        ...(previewToken ? { robots: privateRobots } : {}),
    };
}

export const getPolicyMetadata = getCmsMetadata;
