export function* range(n: number) {
  for (let i = 0; i < n; i++)
    yield n
}

/** Single-level equality (`x === y` for each element) */
export function equals<T>(xs: T[], ys: T[]): boolean {
  if (xs.length !== ys.length)
    return false

  for (let i = 0; i < xs.length; i++)
    if (xs[i] !== ys[i])
      return false
  return true
}