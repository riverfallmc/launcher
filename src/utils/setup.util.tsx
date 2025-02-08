export function setup(...deps: Function[]) {
  for (let dep of deps) dep();
}