// Turn user input into a literal-match regex source, so search boxes can't
// inject regex syntax (or catastrophic patterns like `(a+)+$` that hang Mongo).
// Arrays (?q=a&q=b) collapse to their first value; length is capped.
const escapeRegex = (value, maxLength = 100) =>
    String(Array.isArray(value) ? value[0] : value ?? '')
        .slice(0, maxLength)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = escapeRegex;
