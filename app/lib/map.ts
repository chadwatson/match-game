export function merge<K, V>(mapA: Map<K, V>) {
  return (mapB: Map<K, V>) => {
    const result = new Map<K, V>(mapB);
    for (const [key, value] of mapA) {
      result.set(key, value);
    }
    return result;
  };
}

export function set<K, V>(key: K) {
  return (value: V) => (map: Map<K, V>) => {
    const result = new Map(map);
    result.set(key, value);
    return result;
  };
}

export function remove<K, V>(key: K) {
  return (map: Map<K, V>) => {
    const result = new Map(map);
    result.delete(key);
    return result;
  };
}

export function update<K, V>(key: K) {
  return (fn: (value: V) => V) => (map: Map<K, V>) => {
    const result = new Map(map);
    if (result.has(key)) {
      result.set(key, fn(result.get(key) as V));
    }
    return result;
  };
}
