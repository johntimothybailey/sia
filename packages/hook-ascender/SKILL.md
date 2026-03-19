---
name: hook-ascender
description: Enforces presentation-first React components by moving non-trivial hook logic into domain-named custom hooks. Use when implementing tickets or feature requests that touch React or TSX components, especially when creating or editing UI components with multiple hooks, derived state, effects, or async data hooks such as useQuery, useMutation, Convex queries, or similar.
---

# Hook Ascender

## Purpose
Keep React components presentation-focused. When a component starts accumulating hook-driven state, effects, async data access, or derived logic, ascend that logic into a nearby custom hook instead of expanding the component.

## Trigger
Apply this skill whenever you create or edit a React component.

This includes ticket-driven implementation work where the user only asks the agent to read a Linear ticket, inspect an existing component, and make the requested UI change. Do not wait for the user to mention hooks explicitly. If the task leads to editing a React or TSX component, evaluate whether the HookAscender Protocol applies.

You must trigger the HookAscender Protocol if any of these are true:
- the component already has more than two standard hooks such as `useState` or `useEffect`
- your edit would raise the component above two standard hooks
- the component uses complex async hooks such as TanStack Query `useQuery` or `useMutation`, Convex queries or mutations, or similar data-fetching or mutation hooks

When working from a ticket or product request, treat these as likely trigger situations:
- the change adds loading, saving, or error handling to a component
- the change introduces query, mutation, or cache coordination
- the component starts accumulating derived UI state or multiple handlers
- the implementation would otherwise add `useMemo`, `useCallback`, or several local state variables

## Exceptions
These may remain in the component when they are truly local and trivial:
- a single UI-only `useState` such as `isOpen`
- a basic DOM `useRef`
- utility wrapper components whose primary job is composing hooks rather than rendering presentation

If the logic is not clearly trivial, ascend it.

## HookAscender Protocol
### 1. Evaluate component complexity
Before adding hooks, check:
- current hook count
- whether async data hooks are present
- whether the new behavior introduces derived state, memoization, callbacks, orchestration, or multiple event handlers

If the protocol is triggered, do not keep adding logic directly to the component.

### 2. Normalize file structure
If the component is a standalone shared file such as `src/components/UserProfile.tsx`, convert it into a dedicated folder such as `src/components/UserProfile/`.

Follow the repository's existing component pattern:
- use `index.tsx` if sibling-folder components are index-based
- use `ComponentName.tsx` if the repo prefers explicit filenames

Do not reshuffle files unnecessarily when the component already lives in an appropriate folder.

### 3. Create a domain-named hook
Create a TypeScript hook file beside the component.

Name the hook for the business logic it owns, not the component name:
- good: `useAuthState.ts`, `useCheckoutFlow.ts`, `useUserPermissions.ts`
- avoid: `useUserProfile.ts` when the logic is really auth, billing, search, or permissions

If multiple domains exist, choose the dominant one or split responsibilities instead of creating a vague grab-bag hook.

### 4. Ascend logic
Move these concerns out of the component and into the hook:
- stateful logic
- effects
- async queries and mutations
- non-trivial derived state
- `useMemo` and `useCallback`
- orchestration handlers that coordinate multiple states or side effects

Keep the component focused on:
- rendering
- markup structure
- straightforward prop passing
- trivial UI-only state allowed by the exceptions above

### 5. Return a minimal typed interface
The custom hook must return a clean, strongly typed interface containing only what the component needs to render:
- display-ready state
- fetched data already shaped for the UI when practical
- handler functions the UI invokes
- loading, error, or status flags that affect rendering

Do not leak unnecessary implementation details or internal intermediate state.

### 6. Refactor the component
Update the component to consume the single custom hook and remain presentation-first.

Target shape:
- imports React utilities and the custom hook
- calls one domain hook
- renders based on the hook result
- avoids embedding business rules, async coordination, or memoization logic inline

## Guardrails
- Do not add `useMemo`, `useCallback`, multiple state variables, or async orchestration directly in a presentation component once the protocol is triggered.
- Prefer one domain hook over several unrelated hooks in the component.
- Keep naming business-oriented and specific.
- Preserve existing project conventions for folders, exports, and file naming.
- If moving logic would create a clearly worse abstraction, state the reason explicitly before deviating.

## Working Pattern
When the protocol is triggered:
1. identify the component's business responsibility
2. create or normalize the component folder if needed
3. create the domain hook beside the component
4. move hook logic into the domain hook
5. define a typed return shape
6. simplify the component down to presentation

When the protocol is not triggered:
1. keep the component simple
2. allow trivial local UI state or DOM refs to remain inline
3. re-check the threshold before adding each additional hook

## Example Intent
- "Read this Linear ticket and implement the React change."
- "Update this TSX screen to match the ticket requirements."
- "Add loading and mutation handling to this React card component."
- "Refactor this component so it stops owning query and effect logic."
- "Before you add another `useEffect`, ascend the logic into a custom hook."
