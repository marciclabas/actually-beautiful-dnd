export function range(n: number) {
  return new Array(n).fill(0).map((_, i) => i)
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