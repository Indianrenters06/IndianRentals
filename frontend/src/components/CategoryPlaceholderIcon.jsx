import { Disc, ImageSquare, PresentationChart } from '@phosphor-icons/react';

export default function CategoryPlaceholderIcon({ name, slug, className }) {
    const category = `${slug || ''} ${name || ''}`.toLowerCase();
    const Icon = /panaboard|whiteboard/.test(category)
        ? PresentationChart
        : /\bdvd\b/.test(category) ? Disc : ImageSquare;
    return <Icon weight="light" className={className} aria-hidden="true" />;
}
