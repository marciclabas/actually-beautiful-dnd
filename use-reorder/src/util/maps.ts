
/** `xs` without `k` */
export function remove<K, V>(xs: Map<K, V>, k: K): Map<K, V> {
    const result = new Map(xs);
    result.delete(k);
    return result;
}

/** `xs` with `f` applied to each value */
export function mapV<K, V, O>(xs: Map<K, V>, f: (v: V) => O): Map<K, O> {
    const entries = [...xs.entries()].map(([k, v]) => [k, f(v)] as [K, O]);
    return new Map(entries);
}

/**
 * `xs` with the entries of `ys` (`ys` override `xs`)
 */
export function update<K1, V1, K2, V2>(xs: Map<K1, V1>, ys: Array<[K2, V2]>): Map<K1|K2, V1|V2> {
    const result = new Map<K1|K2, V1|V2>(xs);
    for (const [k, v] of ys)
        result.set(k, v);
    return result;
}

/** `xs` but `xs[k] === v` */
export function insert<K1, V1, K2, V2>(xs: Map<K1, V1>, k: K2, v: V2): Map<K1|K2, V1|V2> {
    const result = new Map<K1|K2, V1|V2>(xs);
    result.set(k, v);
    return result;
}