export function debounce(fn: Function, delay: number) {
  let timeoutId: number | undefined;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}
