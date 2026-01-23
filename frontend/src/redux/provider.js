'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { restoreCart } from './features/cartSlice';

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

        // Save on change
        const unsubscribe = store.subscribe(() => {
            const state = store.getState();
            localStorage.setItem('cart', JSON.stringify(state.cart));
        });

        return () => unsubscribe();
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
