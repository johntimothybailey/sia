/**
 * @file useInventory.ts
 * @description Specialist hook for real-time inventory perception.
 * 
 * ADVANCED PATTERN:
 * - Decouples inventory management from cart actions.
 * - Single Responsibility: Read-only perception of product availability.
 */

import { useQuery } from '@tanstack/react-query';

export const useInventory = (productId: string) => {
    const { data: inventory = 0, isLoading: isLoadingInventory } = useQuery({
        queryKey: ['inventory', productId],
        queryFn: async () => {
            // Simulated API call with artificial delay
            await new Promise((resolve) => setTimeout(resolve, 500));
            return Math.floor(Math.random() * 10);
        },
        refetchInterval: 5000,
    });

    return { inventory, isLoadingInventory };
};
