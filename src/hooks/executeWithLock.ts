type Lock = {
  value: boolean;
};

export function executeWithLock(lock: Lock, operation: () => void) {
  'worklet';
  if (lock.value) {
    return;
  }

  lock.value = true;
  try {
    operation();
  } finally {
    lock.value = false;
  }
}
