import { createUpdate, createUpdateQueue, enqueueUpdate } from "./upDateQueue";
import { scheduleUpdateOnFiber } from "./workLoop";

let currentlyRenderingFiber = null;
let workInProgressHook = null;

export function renderWithHooks(wip) {
  currentlyRenderingFiber = wip;
  wip.memoizedState = null;

  const current = wip.alternate;
  if (current !== null) {
    // update
  } else {
    // mount
  }

  const Component = wip.type;
  const props = wip.props;
  const children = Component(props);

  currentlyRenderingFiber = null;
  return children;
}

const HooksDispatcherOnMount = {
  useState: mountState,
};

function mountWorkInProgressHook() {
  const hook = {
    momoizedState: null,
    updateQueue: null,
    next: null,
  };
  if (workInProgressHook === null) {
    // This is the first hook in the list
    if (currentlyRenderingFiber === null) {
      throw new Error(
        "Hooks can only be called inside the body of a function component."
      );
    } else {
      workInProgressHook = hook;
      currentlyRenderingFiber.memoizedState = hook;
    }
  } else {
    workInProgressHook.next = hook;
    workInProgressHook = hook;
  }
}

function dispatchSetState(fiber, updateQueue, action) {
  const update = createUpdate(action);
  enqueueUpdate(updateQueue, update);
  scheduleUpdateOnFiber(fiber);
}

function mountState(initialState) {
  // 得到当前 useState 对应的 hook数据
  const hook = mountWorkInProgressHook();
  let memoizedState;
  if (initialState instanceof Function) {
    memoizedState = initialState();
  } else {
    memoizedState = initialState;
  }

  const queue = createUpdateQueue();
  hook.updateQueue = queue;

  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
  queue.dispatch = dispatch;
  return [memoizedState];
}
