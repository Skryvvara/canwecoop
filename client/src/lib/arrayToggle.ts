export const toggle = (arr: any[], item: any) =>
  arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
