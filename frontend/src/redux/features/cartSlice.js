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
            const existingItem = state.items.find((item) => item.id === newItem.id);

            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    name: newItem.name,
                    image: newItem.image,
                    price: newItem.price,
                    monthlyRent: newItem.monthlyRent || newItem.price,
                    quantity: newItem.quantity,
                    duration: newItem.duration, // Rental duration in months
                    refundableAmount: newItem.refundableAmount || 0,
                    description: newItem.description,
                    tenures: newItem.tenures // Pricing logic
                });
                state.totalQuantity += newItem.quantity;
            } else {
                existingItem.quantity += newItem.quantity;
                state.totalQuantity += newItem.quantity;
            }

            // Recalculate totals if needed
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.items = state.items.filter((item) => item.id !== id);
            }
        },
        updateCartItemQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                const diff = quantity - item.quantity;
                item.quantity = quantity;
                state.totalQuantity += diff;
            }
        },
        updateCartItem: (state, action) => {
            const { id, ...updates } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                // Handle quantity update specifically to adjust totalQuantity
                if (updates.quantity !== undefined) {
                    const diff = updates.quantity - item.quantity;
                    state.totalQuantity += diff;
                }
                // Update other fields
                Object.assign(item, updates);
            }
        },
        restoreCart: (state, action) => {
            state.items = action.payload.items || [];
            state.totalQuantity = action.payload.totalQuantity || 0;
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
