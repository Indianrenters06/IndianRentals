import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    coupon: null, // { code, discountAmount, description }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            // Requirement: Only 1 product can only be added in the entire cart, and quantity cannot be changed (always 1)
            state.items = [{
                id: newItem.id,
                name: newItem.name,
                image: newItem.image,
                price: newItem.price,
                monthlyRent: newItem.monthlyRent || newItem.price,
                quantity: 1, // Quantity strictly 1
                duration: newItem.duration || 1, // Rental duration in months
                refundableAmount: newItem.refundableAmount || 0,
                description: newItem.description,
                tenures: newItem.tenures,
                sourceUrl: newItem.sourceUrl || (newItem.id ? `/products/${newItem.id}` : '/products')
            }];
            state.totalQuantity = 1;
        },
        removeFromCart: (state, action) => {
            state.items = [];
            state.totalQuantity = 0;
            state.coupon = null;
        },
        updateCartItemQuantity: (state, action) => {
            // Quantity is immutable (strictly 1)
            if (state.items.length > 0) {
                state.items[0].quantity = 1;
                state.totalQuantity = 1;
            }
        },
        updateCartItem: (state, action) => {
            const { id, ...updates } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                // Prevent any modification to quantity
                delete updates.quantity;
                Object.assign(item, updates);
                item.quantity = 1;
                state.totalQuantity = 1;
            }
        },
        restoreCart: (state, action) => {
            const rawItems = action.payload.items || [];
            if (rawItems.length > 0) {
                // Sanitize restored cart to strictly 1 item of quantity 1
                const first = {
                    ...rawItems[0],
                    quantity: 1,
                    sourceUrl: rawItems[0].sourceUrl || (rawItems[0].id ? `/products/${rawItems[0].id}` : '/products')
                };
                state.items = [first];
                state.totalQuantity = 1;
            } else {
                state.items = [];
                state.totalQuantity = 0;
            }
            state.totalAmount = action.payload.totalAmount || 0;
            state.coupon = action.payload.coupon || null;
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            state.coupon = null;
        },
        setCoupon: (state, action) => {
            state.coupon = action.payload;
        },
        removeCoupon: (state) => {
            state.coupon = null;
        }
    },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, updateCartItem, restoreCart, clearCart, setCoupon, removeCoupon } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
export const selectCartTotalAmount = (state) =>
    state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

/**
 * Computes all checkout totals derived from cart items.
 * Single source of truth used by Cart, Address, KYC, and Payment pages.
 */
export const selectCartTotals = (state) => {
    const items = state.cart.items;
    const securityAmount = items.reduce((acc, i) => acc + ((i.refundableAmount || 0) * i.quantity), 0);
    const deliveryCharges = items.length > 0 ? 400 : 0;
    const monthlyRentTotal = items.reduce((acc, i) => acc + ((i.monthlyRent || i.price) * i.quantity), 0);
    const totalGST = Math.round(monthlyRentTotal * 0.18);
    const totalOneTime = securityAmount + deliveryCharges + monthlyRentTotal + totalGST;
    // payToday = first month rent + GST + delivery (security is separate)
    const payToday = monthlyRentTotal + totalGST + deliveryCharges;
    // Apply coupon if exists
    const couponDiscount = state.cart.coupon ? state.cart.coupon.discountAmount : 0;
    const netPayToday = Math.max(0, payToday - couponDiscount);

    const baseSavedAmount = items.length > 0 ? Math.max(0, totalOneTime * 0.1) : 0; // 10% savings indicator
    const savedAmount = baseSavedAmount + couponDiscount;

    return { securityAmount, deliveryCharges, monthlyRentTotal, totalGST, totalOneTime, payToday, savedAmount, couponDiscount, netPayToday, couponCode: state.cart.coupon?.code || null };
};

export default cartSlice.reducer;
