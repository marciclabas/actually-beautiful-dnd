# Use Reorder

> Hooks API wrapper around `react-beautiful-dnd`

## Hooks API

Same result, but simple code.

```jsx
import { useReorder, Item } from 'use-reorder'

function MyComponent() {
    const items: Item[] = [
        { id: 'id1', elem: <div>...</div> },
        // ...
        { id: 'idn', elem: <div>...</div> },
    ]

    const { order, ordered, reorderer } = useReorder(items)
    // ordered = order.map(i => items[i]); provided for convenience

    return (
        <div>
            ...
            {reorderer}
        </div>
    )
}

```