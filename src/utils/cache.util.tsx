export class Cache<T> {
  protected storage: T[] = [];

  public isEmpty(): boolean {
    return this.storage.length === 0
  }

  public push(value: T): number {
    return this.storage.push(value);
  }

  public set(value: T[]) {
    this.storage = value;
  }

  public get(index: number): T | undefined {
    return this.storage[index];
  }

  public getStorage(): T[] {
    return this.storage;
  }

  public find<K extends keyof T>(key: K, value: T[K]): T | undefined {
    return this.storage.find(v => v[key] === value)
  }
}