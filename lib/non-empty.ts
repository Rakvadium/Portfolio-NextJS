// `Array.prototype.map` forgets that a tuple was non-empty. This keeps it, so non-empty props and
// hook arguments are satisfiable from `site.roles` and `site.sections` without a cast at the call site.
export type NonEmpty<T> = readonly [T, ...T[]];

export function mapNonEmpty<T, U>(xs: NonEmpty<T>, f: (x: T, i: number) => U): [U, ...U[]] {
  return xs.map(f) as [U, ...U[]]; // the one sanctioned cast: map preserves length
}
