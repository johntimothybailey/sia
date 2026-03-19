/**
 * @file coordinator.ts
 * @description Advanced Coordinator Hook.
 * 
 * PRINCIPAL PATTERN:
 * - Composes Multiple Specialist Hooks.
 * - Manages 'glue' state (quantity) and orchestrates domain interactions.
 * - Provides a clean, unified interface for the UI.
 */

import { useState, useCallback } from 'react';
import { useInventory } from './useInventory';
import { useCartMutations } from './useCartMutations';

export const useProductWorkflow = (productId: string, price: number) => {
    const [quantity, setQuantity] = useState(1);

    // 1. Compose Specialist: Inventory Perception
    const { inventory, isLoadingInventory } = useInventory(productId);

    // 2. Compose Specialist: Cart Actions
    const { addToCart, isAdding, error } = useCartMutations(productId, price);

    // 3. Orchestrate
    const increment = useCallback(() => {
        setQuantity((q) => Math.min(inventory, q + 1));
    }, [inventory]);

    const decrement = useCallback(() => {
        setQuantity((q) => Math.max(1, q - 1));
    }, []);

    const handleAddToCart = useCallback(async () => {
        await addToCart(quantity);
        setQuantity(1); // Reset after success
    }, [addToCart, quantity]);

    // 4. Final Interface
    return {
        // State
        quantity,
        inventory,
        isLoadingInventory,
        isAdding,
        error,
        // Actions
        increment,
        decrement,
        addToCart: handleAddToCart,
        // UI Helpers (derived state)
        isOutOfStock: !isLoadingInventory && inventory === 0,
        canIncrement: !isLoadingInventory && quantity < inventory,
    };
};
