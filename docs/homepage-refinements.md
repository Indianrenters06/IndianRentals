# Homepage and location controls

## Admin editing

Open **Dashboard → CMS → Homepage → Rental Process**.

1. Enable the section and edit its title/subtitle.
2. Use **Add step** to create a step; edit its title, description and optional link.
3. Upload a **Step illustration**, then enter its **Image description** for screen readers.
4. Use **Remove image and use icon** to return to the selected Phosphor fallback.
5. Move steps with the up/down buttons, or remove a step.
6. Save the homepage. Reload the storefront to see the saved configuration.

An empty steps list hides the section. The admin no longer repopulates a deliberately empty list. Desktop uses four columns, tablet two columns, and mobile a vertical sequence.

Under **Trust Factors**, upload a replacement Why Choose Us image or choose **Use default equipment image**. Existing custom images remain supported.

Best Rented Products and New Launches retain their CMS product selection. Select at least three published products for a complete row; the UI never duplicates products to fill empty slots. Three cards fit each viewport, align left, and keep cart/wishlist integration.

## Location behavior

- Opens from the bottom on desktop, tablet and mobile; mobile uses a full-width bottom sheet.
- City changes remain a draft until Continue; closing/Escape discards the draft.
- Pincodes are checked through the existing backend serviceability endpoint. API errors and unserviceable pincodes cannot be saved as verified locations.
- City selection is a browsing preference, not a promise that every pincode in that city is serviceable.
- The existing userLocation browser-storage contract is preserved.
- Eight city illustrations are local assets. This city list is maintained in LocationSelector.jsx; delivery serviceability remains backend-managed.
- Native dialog provides modal focus behavior; reduced-motion preferences disable the entrance animation.

## Implementation

RentalProcess reads rentalProcessSteps from the homepage CMS. RentalStepsEditor updates the same list through the existing homepage save flow. The CMS schema now includes imageAlt; image, icon, link and highlight remain compatible. ImageUploader synchronizes previews when a parent removes or reorders an image.

Hero uses fluid slide dimensions with bounded margins and matching controls at every breakpoint. BestRentedProducts uses a single carousel and shared RentalProductCard, replacing separate mobile/desktop card implementations.

## Design references

- [Figma location picker](https://www.figma.com/design/lB3vJxPhUKgF4Su1TxMSEo/Changes?node-id=24145-17147): pincode, eight-city grid and primary action.
- [Amazon location dialog via Mobbin](https://mobbin.com/screens/d9ae2375-9c53-4c3d-b4e5-a9051247c59f): explicit apply behavior and compact grouping.
- [Hers process section via Mobbin](https://mobbin.com/screens/026b7557-4b01-4ff1-9064-21acae40054f): visible numbered sequence.
- Artwork prompts are recorded in homepage-asset-prompts.md.

## Verification and limits

- Frontend production build and scoped ESLint passed.
- Admin production build passed; scoped admin lint has no errors (existing image/hook warnings remain).
- CMS model validation confirmed imageAlt, image removal and empty-step lists.
- Browser checks at 390, 822 and 1440 pixels showed no horizontal overflow; three product cards stay left-aligned. All eight city images and the replacement equipment image loaded.
- Verified location cancellation, focus restoration, invalid-pincode feedback and delivery-service error feedback.
- Dependency audits reported no vulnerabilities for frontend production dependencies and the admin install. This is not a complete security audit.
- Local port 5001 is a read-only sample API. Real admin upload/save persistence and successful pincode serviceability have not been exercised against the live backend/database. These require the real API and an authenticated admin session.
