// Migration preview for the four published image-only offers. The mapped
// content becomes normal CMS data the next time the homepage draft is saved.
const campaigns = [
    ['n5emsvlbxliwhwtzktjo', 'camera', 'The shot starts here.', 'Camera kits for shoots and events.', 'Explore cameras', '/services/camera-rental'],
    ['hntnavdi2ghev6zmbhom', 'laptop', 'Laptops for your next project.', 'For teams, projects and events.', 'Explore laptops', '/services/laptop-rental'],
    ['gf3prsd4cczget76kjjd', 'av', 'Make the moment bigger.', 'Screens, sound and presentation gear.', 'Explore AV gear', '/services/av-equipment-rental'],
    ['v14pbfzhoie2yfokkqlx', 'gaming', 'Play at full power.', 'Gaming laptops and consoles on rent.', 'Explore gaming', '/products?keyword=gaming'],
];

export function resolveOfferCampaign(offer) {
    const campaign = campaigns.find(([legacyId]) => offer.image?.includes(legacyId));
    if (!campaign || offer.title || offer.subtitle || offer.ctaText || offer.link) return offer;
    const [, asset, title, subtitle, ctaText, link] = campaign;
    return { ...offer, image: `/images/home/offers/${asset}-campaign.webp`, title, subtitle, ctaText, link };
}

export function offerPreviewUrl(image) {
    if (!image?.startsWith('/') || image.startsWith('//')) return image;
    const storefront = process.env.NEXT_PUBLIC_STOREFRONT_URL || (process.env.NODE_ENV === 'production' ? 'https://indianrenters.com' : 'http://localhost:3000');
    return `${storefront.replace(/\/$/, '')}${image}`;
}
