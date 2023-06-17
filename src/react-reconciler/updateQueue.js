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
  };
}

export function enqueueUpdate(updateQueue, update) {
  updateQueue.shared.pending = update;
}

export function processUpdateQueue(baseState, pendingUpdate) {
  const result = {
    memoziedState: baseState,
  };

  const action = pendingUpdate?.action;

  result.memoziedState = isFunction(action) ? action(baseState) : action;

  return result;
}
