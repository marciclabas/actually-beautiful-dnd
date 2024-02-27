/** Updates order by moving `from` to `to`, shifting the items in between */
export function reorder(order: number[], from: number, to: number): number[] {
  const newOrder = [...order]
  const [removed] = newOrder.splice(from, 1)
  newOrder.splice(to, 0, removed)
  return newOrder
}