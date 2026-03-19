/**
 * @file ProductCard.tsx
 * @description Advanced Presentation Component.
 * 
 * PRINCIPAL PATTERN:
 * - Minimalist UI Shell.
 * - Zero business logic inline.
 * - Clean prop delegation to the coordinator.
 */

import React, { useState } from 'react';
import { useProductWorkflow } from './coordinator';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
}

export const AdvancedProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // 1. Single entry point to complex logic
    const {
        quantity,
        inventory,
        isLoadingInventory,
        isAdding,
        increment,
        decrement,
        addToCart,
        isOutOfStock,
        canIncrement
    } = useProductWorkflow(product.id, product.price);

    return (
        <div className="border rounded-xl p-6 shadow-lg bg-white overflow-hidden transition-all hover:shadow-xl">
            <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-56 object-cover rounded-lg" />
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-red-600 font-bold text-lg uppercase tracking-wider">Out of Stock</span>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                <p className="text-lg font-medium text-blue-600">${product.price}</p>
            </div>

            {isExpanded && (
                <p className="mt-4 text-sm text-gray-600 leading-relaxed border-t pt-4">
                    {product.description}
                </p>
            )}

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-center text-xs font-semibold text-gray-400 mt-4 hover:text-gray-600 transition-colors"
            >
                {isExpanded ? 'Collapse Product Details' : 'Expand Product Details'}
            </button>

            <div className="mt-6 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">
                        {isLoadingInventory ? 'Syncing...' : `${inventory} units available`}
                    </span>
                    <div className="flex items-center space-x-4 mt-1">
                        <button
                            onClick={decrement}
                            className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"
                            disabled={isAdding || isOutOfStock}
                        >-</button>
                        <span className="font-mono font-bold text-lg">{quantity}</span>
                        <button
                            onClick={increment}
                            className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"
                            disabled={isAdding || !canIncrement}
                        >+</button>
                    </div>
                </div>

                <button
                    onClick={addToCart}
                    disabled={isAdding || isOutOfStock}
                    className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-black transition-colors disabled:bg-gray-300 shadow-sm active:scale-95 transform"
                >
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};
