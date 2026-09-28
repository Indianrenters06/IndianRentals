// Appearance-only controls: callers keep their existing banner geometry.
export function bannerStyle(cms) {
    const color = cms?.bannerBackground;
    return typeof color === 'string' && /^#[\da-f]{6}$/i.test(color) ? { backgroundColor: color } : undefined;
}

export function BannerText({ cms, title, children }) {
    // Retain the document heading for assistive technology when the overlay is off.
    return cms?.bannerShowText === false ? <h1 className="sr-only">{title}</h1> : children;
}
