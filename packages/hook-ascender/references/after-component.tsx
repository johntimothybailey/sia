/**
 * @file after-component.tsx
 * @description Presentation-only component post-refactor.
 * 
 * RESOLUTION:
 * - Keeps ONLY 'isExpanded' (trivial UI state).
 * - Consumes 'useCartActions' for all business logic.
 * - Presentation logic is now clean and focused.
 */

import React, { useState } from 'react';
import { useCartActions } from './after-hook';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // 1. Consume the domain hook
    const {
        quantity,
        increment,
        decrement,
        addToCart,
        isAdding,
        inventory,
        isLoadingInventory
    } = useCartActions(product.id, product.price);

    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
            <h3 className="mt-2 text-lg font-bold">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>

            {isExpanded && (
                <p className="mt-2 text-sm text-gray-500">{product.description}</p>
            )}

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-500 text-sm mt-1 underline"
            >
                {isExpanded ? 'Show less' : 'View details'}
            </button>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400">
                        {isLoadingInventory ? 'Checking stock...' : `${inventory} in stock`}
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                        <button onClick={decrement} className="p-1 border rounded" disabled={isAdding}>-</button>
                        <span className="w-4 text-center">{quantity}</span>
                        <button onClick={increment} className="p-1 border rounded" disabled={isAdding || quantity >= inventory}>+</button>
                    </div>
                </div>

                <button
                    onClick={addToCart}
                    disabled={isAdding || inventory === 0}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
                >
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};
