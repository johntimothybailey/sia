/**
 * @file after-hook.ts
 * @description Domain-named custom hook 'useCartActions'.
 * 
 * DESIGN DECISION:
 * - Named 'useCartActions' for the business domain, not the component.
 * - Handles all async data, mutations, and derived state.
 */

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface CartItem {
    id: string;
    productId: string;
    quantity: number;
}

interface CartActions {
    quantity: number;
    increment: () => void;
    decrement: () => void;
    addToCart: () => Promise<void>;
    isAdding: boolean;
    inventory: number;
    isLoadingInventory: boolean;
    error: Error | null;
}

export const useCartActions = (productId: string, price: number): CartActions => {
    const [quantity, setQuantity] = useState(1);
    const queryClient = useQueryClient();

    // 1. Ascended Async Query: Real-time inventory
    const { data: inventory = 0, isLoading: isLoadingInventory } = useQuery({
        queryKey: ['inventory', productId],
        queryFn: async () => {
            // Simulated API call
            return Math.floor(Math.random() * 10);
        },
        refetchInterval: 5000,
    });

    // 2. Ascended Mutation: Add to Cart
    const { mutateAsync: addToCart, isPending: isAdding, error } = useMutation({
        mutationFn: async () => {
            // Simulated API call
            console.log(`Adding ${quantity} of ${productId} to cart at $${price}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    // 3. Ascended Logic: Domain handlers
    const increment = () => setQuantity((q: number) => Math.min(inventory, q + 1));
    const decrement = () => setQuantity((q: number) => Math.max(1, q - 1));

    // 4. Return minimal typed interface
    return {
        quantity,
        increment,
        decrement,
        addToCart: () => addToCart(),
        isAdding,
        inventory,
        isLoadingInventory,
        error: error as Error | null,
    };
};
