/**
 * Customer location lives in the address book (User.addresses[]), not as
 * top-level city/state fields on the user document. Reading `user.city`
 * directly always yields undefined, which is why customer screens showed
 * "N/A"/"—" for everyone.
 *
 * Prefer the address the customer marked default, otherwise the most recently
 * added one. Returns null when no usable address exists.
 */
export function resolveUserLocation(user) {
    const addresses = user?.addresses || [];
    if (addresses.length === 0) return null;

    const address = addresses.find(a => a.isDefault) || addresses[addresses.length - 1];
    const parts = [address?.city, address?.state]
        .map(part => (part || "").trim())
        .filter(Boolean);

    return parts.length ? parts.join(", ") : null;
}
