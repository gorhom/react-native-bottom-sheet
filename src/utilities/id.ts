let current = 0;

export const id = () => {
  current = (current + 1) % Number.MAX_SAFE_INTEGER;
  return current;
};
