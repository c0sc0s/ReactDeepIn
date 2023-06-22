const currentDispatcher = {
  current: null,
};

export const resolveDispatcher = (fiber) => {
  const dispatcher = currentDispatcher.current;
  if (dispatcher === null) {
    throw new Error("Invalid hook call");
  }
  return dispatcher;
};

export default currentDispatcher;
