export const isFunction = (ref: unknown): ref is Function =>
  typeof ref === 'function';
