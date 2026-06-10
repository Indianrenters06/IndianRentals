'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { restoreCart } from './features/cartSlice';
import { restoreWishlist } from './features/wishlistSlice';

export function ReduxProvider({ children }) {
    useEffect(() => {
        // Load initial state
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                store.dispatch(restoreCart(JSON.parse(savedCart)));
            } catch (e) {
                console.error("Failed to load cart", e);
            }
        }

        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            try {
                store.dispatch(restoreWishlist(JSON.parse(savedWishlist)));
            } catch (e) {
                console.error("Failed to load wishlist", e);
            }
        }

        // Save on change
        const unsubscribe = store.subscribe(() => {
            const state = store.getState();
            localStorage.setItem('cart', JSON.stringify(state.cart));
            localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
        });

        return () => unsubscribe();
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
