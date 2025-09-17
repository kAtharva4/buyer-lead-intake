const inMemoryStore = new Map();

export const rateLimit = (options: { windowMs: number, max: number }) => {
  return async (key: string): Promise<{ success: boolean }> => {
    const now = Date.now();
    const windowStart = now - options.windowMs;

    const requests = inMemoryStore.get(key) || [];
    const validRequests = requests.filter((timestamp: number) => timestamp > windowStart);

    if (validRequests.length < options.max) {
      validRequests.push(now);
      inMemoryStore.set(key, validRequests);
      return { success: true };
    } else {
      return { success: false };
    }
  };
};