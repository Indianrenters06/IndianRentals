// Existing published offer images are upgraded to editable campaign cards until
// the new artwork and copy are saved from the homepage CMS.
const campaigns = [
    {
        legacyId: 'n5emsvlbxliwhwtzktjo',
        image: '/images/home/offers/camera-campaign.webp',
        title: 'The shot starts here.',
        subtitle: 'Camera kits for shoots and events.',
        ctaText: 'Explore cameras',
        link: '/services/camera-rental',
    },
    {
        legacyId: 'hntnavdi2ghev6zmbhom',
        image: '/images/home/offers/laptop-campaign.webp',
        title: 'Laptops for your next project.',
        subtitle: 'For teams, projects and events.',
        ctaText: 'Explore laptops',
        link: '/services/laptop-rental',
    },
    {
        legacyId: 'gf3prsd4cczget76kjjd',
        image: '/images/home/offers/av-campaign.webp',
        title: 'Make the moment bigger.',
        subtitle: 'Screens, sound and presentation gear.',
        ctaText: 'Explore AV gear',
        link: '/services/av-equipment-rental',
    },
    {
        legacyId: 'v14pbfzhoie2yfokkqlx',
        image: '/images/home/offers/gaming-campaign.webp',
        title: 'Play at full power.',
        subtitle: 'Gaming laptops and consoles on rent.',
        ctaText: 'Explore gaming',
        link: '/products?keyword=gaming',
    },
];

export function resolveOfferCampaign(offer) {
    const campaign = campaigns.find(({ legacyId }) => offer.image?.includes(legacyId));
    // A CMS edit takes precedence over the one-time legacy migration.
    if (!campaign || offer.title || offer.subtitle || offer.ctaText || offer.link) return offer;
    return { ...offer, ...campaign, altText: '' };
}
