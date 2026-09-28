// Existing storefront artwork keeps the hero usable on a first visit during a
// CMS outage. No temporary offer or price is embedded in this fallback.
export const DEFAULT_HERO_SLIDES = [
  {image:'/macbook-pro-new.jpg',alt:'MacBook rentals',ctaLink:'/products'},
  {image:'/it-products-new.jpg',alt:'IT equipment rentals',ctaLink:'/products'},
  {image:'/office-equipment-new.jpg',alt:'Office equipment rentals',ctaLink:'/products'},
  {image:'/ipad-new.jpg',alt:'iPad rentals',ctaLink:'/products'},
];

const imageValue = value => typeof value === 'string' && value.trim().length > 0;
export function heroSlidesFor(content) {
  if (content?.heroEnabled === false) return [];
  const slides = Array.isArray(content?.heroSlides) ? content.heroSlides.filter(slide=>slide && (imageValue(slide.bgImage) || imageValue(slide.image))) : [];
  if (slides.length) return slides;
  // Some existing CMS records use the original single-banner fields.
  if (imageValue(content?.heroImage)) return [{image:content.heroImage,title:content.heroTitle,subtitle:content.heroSubtitle,ctaLink:'/products'}];
  return DEFAULT_HERO_SLIDES;
}

const CACHE_LIFETIME = 24*60*60*1000;
const FIELDS = ['heroEnabled','heroSlides','heroImage','heroTitle','heroSubtitle','featureSectionEnabled','featureSectionTitle','featureSectionSubtitle','featureSectionCtaLink','featureSectionCtaText','featureSectionImage','featureSectionStats'];
function pickContent(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !FIELDS.some(key=>key in value)) throw new Error('Invalid homepage content');
  const content = Object.fromEntries(FIELDS.filter(key=>key in value).map(key=>[key,value[key]]));
  for (const key of ['heroEnabled','featureSectionEnabled']) if (key in content && typeof content[key] !== 'boolean') throw new Error('Invalid homepage visibility');
  if ('featureSectionStats' in content && !Array.isArray(content.featureSectionStats)) content.featureSectionStats=[];
  return content;
}

export function createHomepageContentLoader({api,fetcher=fetch,storage=()=>null,now=Date.now,timeout=4000,retryDelay=300,onFallback=()=>{}}) {
  const key = `ir-homepage-content-v1:${api}`;
  let memory;
  let pending;
  function cached() {
    try {
      const saved = memory || JSON.parse(storage()?.getItem(key) || 'null');
      if (saved && saved.savedAt <= now() && now()-saved.savedAt < CACHE_LIFETIME) return pickContent(saved.content);
    } catch { /* A blocked cache must not break the page. */ }
    return null;
  }
  async function request() {
    let lastError;
    for(let attempt=0;attempt<2;attempt++) {
      try {
        const response = await fetcher(`${api}/api/cms/homepage`,{cache:'no-store',signal:AbortSignal.timeout(timeout)});
        if (!response.ok) throw new Error(`Homepage content returned ${response.status}`);
        const content = pickContent(await response.json());
        memory = {savedAt:now(),content};
        try {storage()?.setItem(key,JSON.stringify(memory));} catch { /* Memory cache still works. */ }
        return content;
      } catch(error) {lastError=error;}
      if(attempt===0) await new Promise(resolve=>setTimeout(resolve,retryDelay));
    }
    const content = cached();
    onFallback(lastError, Boolean(content));
    // Explicit false values in a successful cached response remain authoritative.
    return content || {heroEnabled:true,heroSlides:DEFAULT_HERO_SLIDES,featureSectionEnabled:true};
  }
  return {
    load() {
      // Hero and feature mount together; share their request/retry, not two races.
      if (!pending) pending=request().finally(()=>{pending=null;});
      return pending;
    },
  };
}
