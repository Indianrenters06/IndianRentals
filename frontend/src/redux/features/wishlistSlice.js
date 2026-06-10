import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        // Add the product if absent, remove it if already saved.
        toggleWishlist: (state, action) => {
            const product = action.payload;
            const idx = state.items.findIndex((i) => i.id === product.id);
            if (idx >= 0) {
                state.items.splice(idx, 1);
            } else {
                state.items.unshift({
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    rentPrice: product.rentPrice,
                    originalPrice: product.originalPrice,
                    discount: product.discount,
                    isNew: product.isNew || false,
                    rating: product.rating,
                    reviewCount: product.reviewCount ?? product.reviews,
                });
            }
        },
        addToWishlist: (state, action) => {
            const product = action.payload;
            if (!state.items.some((i) => i.id === product.id)) {
                state.items.unshift({ ...product });
            }
        },
        removeFromWishlist: (state, action) => {
            state.items = state.items.filter((i) => i.id !== action.payload);
        },
        restoreWishlist: (state, action) => {
            state.items = action.payload.items || [];
        },
        clearWishlist: (state) => {
            state.items = [];
        },
    },
});

export const { toggleWishlist, addToWishlist, removeFromWishlist, restoreWishlist, clearWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
// Usage: useSelector(selectIsWishlisted(product.id))
export const selectIsWishlisted = (id) => (state) => state.wishlist.items.some((i) => i.id === id);

export default wishlistSlice.reducer;
