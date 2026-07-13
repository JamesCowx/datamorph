export function filterRows<T>(data: T[], predicate: (row: T) => boolean): T[] { return data.filter(predicate); }
export function mapColumns<T, R>(data: T[], transform: (row: T) => R): R[] { return data.map(transform); }
export function aggregate<T>(data: T[], key: keyof T, value: keyof T, operation: "sum" | "avg" | "count" | "min" | "max"): Record<string, number> {
  const groups: Record<string, number[]> = {};
  for (const row of data) { const k = String(row[key]); if (!groups[k]) groups[k] = []; groups[k].push(Number(row[value])); }
  const result: Record<string, number> = {};
  for (const [k, vals] of Object.entries(groups)) {
    if (operation === "sum") result[k] = vals.reduce((a, b) => a + b, 0);
    if (operation === "avg") result[k] = vals.reduce((a, b) => a + b, 0) / vals.length;
    if (operation === "count") result[k] = vals.length;
    if (operation === "min") result[k] = Math.min(...vals);
    if (operation === "max") result[k] = Math.max(...vals);
  }
  return result;
}
export function join<T, U>(left: T[], right: U[], leftKey: keyof T, rightKey: keyof U, type: "inner" | "left" | "right" = "inner"): (T & Partial<U>)[] {
  const joined: (T & Partial<U>)[] = [];
  for (const l of left) { const matches = right.filter(r => l[leftKey] === r[rightKey]); if (matches.length > 0 || type === "left") { matches.length === 0 ? joined.push({ ...l }) : matches.forEach(r => joined.push({ ...l, ...r })); } }
  return joined;
}
