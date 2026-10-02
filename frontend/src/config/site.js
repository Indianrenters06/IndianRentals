// Central SEO / site configuration shared by metadata, sitemap, and JSON-LD.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://indianrenters.com").replace(/\/$/, "");
export const SITE_NAME = "IndianRenters";
export const SITE_TAGLINE = "You Name It, We Rent It";
export const SITE_DESCRIPTION =
    "India's largest tech rental platform. Rent laptops, MacBooks, servers, DSLR cameras, AV equipment and office furniture for business and events — delivered to your door, without the full ownership cost.";
export const API = process.env.NEXT_PUBLIC_API_URL || "/backend";

// Keep the organization logo separate from the 1200×630 share card.
export const LOGO_IMAGE =
    "https://res.cloudinary.com/dgkckcdk8/image/upload/w_1200,q_auto,f_png/v1780249866/logo_indianrenters_tmfo74.png";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/share-image`;

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
