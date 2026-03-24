/**
 * @file before.tsx
 * @description ProductCard at the exact trigger edge.
 * 
 * CURRENT STATE:
 * - 2 trivial useState hooks (isExpanded, quantity).
 * - This is the ceiling for inline logic.
 * 
 * INCOMING FEATURE REQUEST:
 * "Add real-time inventory tracking and an add-to-cart mutation 
 * with loading/error states and cache invalidation."
 * 
 * TRIGGER: Adding the new logic would require useQuery, useMutation,
 * and multiple state variables, pushing this component far beyond 
 * the presentation-first threshold.
 */

import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Trivial handlers for existing local state
  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

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

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={decrement} className="p-1 border rounded">-</button>
          <span>{quantity}</span>
          <button onClick={increment} className="p-1 border rounded">+</button>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </div>
  );
};
