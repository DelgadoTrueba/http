const getGlobalObject = () => {
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }
  throw new Error('Global object cannot be identified.');
};

export default getGlobalObject;
