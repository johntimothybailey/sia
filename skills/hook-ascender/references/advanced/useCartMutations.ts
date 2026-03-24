/**
 * @file useCartMutations.ts
 * @description Specialist hook for cart-related write operations.
 * 
 * ADVANCED PATTERN:
 * - Decouples state changes from data fetching.
 * - Single Responsibility: Managing interactions with the Cart domain.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCartMutations = (productId: string, price: number) => {
    const queryClient = useQueryClient();

    const { mutateAsync: addToCart, isPending: isAdding, error } = useMutation({
        mutationFn: async (quantity: number) => {
            // Simulated API call
            console.log(`Adding ${quantity} of ${productId} to cart at $${price}`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    return {
        addToCart,
        isAdding,
        error: error as Error | null
    };
};
