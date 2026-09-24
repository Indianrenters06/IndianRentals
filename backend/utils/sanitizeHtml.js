const sanitize = require('sanitize-html');

// Rich-text HTML written in the admin panel (blog posts, CMS policy pages) is
// rendered on the storefront with dangerouslySetInnerHTML, so strip anything
// that can run script: <script>, on* handlers, javascript: URLs, etc.
const OPTIONS = {
    allowedTags: sanitize.defaults.allowedTags.concat([
        'img', 'h1', 'h2', 'span', 'u', 's', 'del', 'ins', 'mark', 'sub', 'sup',
        'figure', 'figcaption', 'iframe', 'video', 'source',
    ]),
    allowedAttributes: {
        '*': ['class', 'style', 'id', 'title', 'align'],
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'srcset', 'alt', 'width', 'height', 'loading'],
        iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder'],
        video: ['src', 'controls', 'width', 'height', 'poster'],
        source: ['src', 'type'],
        td: ['colspan', 'rowspan'],
        th: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    // Embeds only from video hosts
    allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com'],
};

const sanitizeHtml = (html) => (typeof html === 'string' ? sanitize(html, OPTIONS) : html);

module.exports = sanitizeHtml;
