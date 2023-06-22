import currentDispatcher, { resolveDispatcher } from "./currentDispatcher";

export const useState = (initialState) => {
  const disptacher = resolveDispatcher();
  return disptacher.useState(initialState);
};

export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  ReactCurrentDispatcher: currentDispatcher,
};
