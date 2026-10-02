const PUBLIC_FIELDS = ['siteName', 'siteLogo', 'contactEmail', 'contactPhone', 'address', 'currency', 'timezone',
    'navbarAnnouncements', 'navbarLinks', 'showNavbarCategories', 'footerDescription', 'footerQuickLinks',
    'footerColumns', 'footerCopyright', 'paymentLogos', 'maintenanceMode', 'allowRegistrations', 'requireKYC', 'robotsTxt', 'llmsTxt'];
const pick = (value, fields) => Object.fromEntries(fields.filter(key => value?.[key] !== undefined).map(key => [key, value[key]]));
function publicSettings(record) {
    const value = record?.toObject?.() || record || {};
    const result = pick(value, PUBLIC_FIELDS);
    result.theme = pick(value.theme, ['activeTheme']);
    result.socialLinks = pick(value.socialLinks, ['facebook', 'twitter', 'instagram', 'linkedin']);
    result.navbarLinks = (value.navbarLinks || []).map(link => pick(link, ['name', 'href', 'separator']));
    result.footerQuickLinks = (value.footerQuickLinks || []).map(link => pick(link, ['name', 'href']));
    result.footerColumns = (value.footerColumns || []).map(column => ({ title: column.title, links: (column.links || []).map(link => pick(link, ['name', 'href'])) }));
    return result;
}
module.exports = { publicSettings };
