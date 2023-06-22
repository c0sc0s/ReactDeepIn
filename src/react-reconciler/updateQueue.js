import { isFunction } from "../shared/utils";

export function createUpdate(action) {
  return {
    action,
  };
}

export function createUpdateQueue() {
  return {
    shared: {
      pending: null,
    },
    dispatch: null,
  };
}

export function enqueueUpdate(updateQueue, update) {
  updateQueue.shared.pending = update;
}

export function processUpdateQueue(baseState, pendingUpdate) {
  const result = {
    memoizedState: baseState,
  };

  const action = pendingUpdate?.action;

  result.memoizedState =
    typeof action === "function" ? action(baseState) : action;

  return result;
}
