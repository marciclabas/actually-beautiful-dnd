# Use Reorder

> Simple hooks-based list reorder running on `react-beautiful-dnd`


Your usual reorderer       |  Optional hint animation
:-------------------------:|:-------------------------:
![Reorderer in action](media/reorder.gif)  |  ![Reorder animation](media/reorder-animation.gif)

## Usage

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

## Hint animation

Optionally, you can install [`framer-animations`](https://www.npmjs.com/package/framer-animations) to add this animation (useful as a simple guide for users)

![User hint animation](media/reorder-animation.gif)

```bash
npm i framer-animations
```

```bash
yarn add framer-animations
```

Exactly the same as `useReorder` but returns a `run` function to trigger the animation
```jsx
import { useAnimatedReorder } from 'use-reorder/dist/animated'

const { reorderer, run } = useAnimatedReorder(items)
```