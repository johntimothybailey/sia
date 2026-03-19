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

## Advanced (Principal/Lead) Pattern

For complex systems, ascending to a single hook is often not enough. Principal engineers and Tech Leads should focus on **specialized decomposition** where logic is split into multiple domain hooks and then composed by a coordinator.

See the [Advanced Directory](./references/advanced/) for this pattern in action.

### The Decomposition Strategy

| Specialist Hook | Responsibility | Why? |
| :--- | :--- | :--- |
| [`useInventory.ts`](./references/advanced/useInventory.ts) | Pure Perception | Isolates real-time data fetching from any state-changing logic. |
| [`useCartMutations.ts`](./references/advanced/useCartMutations.ts) | Write Operations | Encapsulates API interactions, side effects, and cache invalidation. |
| [`coordinator.ts`](./references/advanced/coordinator.ts) | Orchestration | Composes specialists, manages local UI state, and exports a unified interface. |

### The "Clean" Component
In the [Advanced ProductCard](./references/advanced/ProductCard.tsx), the UI remains entirely agnostic of how inventory is fetched or how the cart is updated. It simply consumes the coordinator's "Workflow" interface.

## How to use these references
1. **Model your hooks after `after-hook.ts`**: Focus on clean return shapes and domain naming.
2. **Model your components after `after-component.tsx`**: Focus on rendering and prop delegation.
3. **Use the Advanced Pattern for Complex Domains**: Split concerns early to prevent "God Hooks."
4. **Trigger early**: If your next edit adds a third hook or a first async hook, it's time to ascend.
