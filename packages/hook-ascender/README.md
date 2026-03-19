# Hook-Ascender Walkthrough

This walkthrough demonstrates the **Hook-Ascender Protocol** using a standard E-commerce Product Card scenario.

## The Trigger Scenario

In [before.tsx](./references/before.tsx), we have a component that is currently at the "trigger edge." It contains exactly two trivial `useState` hooks:

```tsx
const [isExpanded, setIsExpanded] = useState(false);
const [quantity, setQuantity] = useState(1);
```

While this is clean, an incoming feature request for **real-time inventory** and **cart mutations** would require adding `useQuery`, `useMutation`, and complex handlers. Adding these inline would violate the presentation-first principle.

## The Resolution

Instead of bloating the component, we **ascend** the logic into a domain-named custom hook.

### 1. The Domain Hook: `useCartActions`
We created [after-hook.ts](./references/after-hook.ts). Note that it is named for the **business domain** (Cart Actions), not the component (Product Card).

| Concerns Moved | Why? |
| :--- | :--- |
| **Async Queries** | Inventory fetching is a data concern, not a UI concern. |
| **Mutations** | Cart updates involve side effects and cache invalidation. |
| **Domain Rules** | Logic like `Math.min(inventory, q + 1)` is a business rule. |
| **Complexity** | It keeps the component tree shallow and testable. |

### 2. The Presentation-First Component
We refactored the component in [after-component.tsx](./references/after-component.tsx).

The component now consumes a single, clean interface:

```tsx
const { 
  quantity, 
  increment, 
  decrement, 
  addToCart, 
  isAdding, 
  inventory, 
  isLoadingInventory 
} = useCartActions(product.id, product.price);
```

**Result:** The component remains a lean "markup shell," while the `useCartActions` hook becomes a reusable, testable container for business intelligence.

## How to use these references
1. **Model your hooks after `after-hook.ts`**: Focus on clean return shapes and domain naming.
2. **Model your components after `after-component.tsx`**: Focus on rendering and prop delegation.
3. **Trigger early**: If your next edit adds a third hook or a first async hook, it's time to ascend.
