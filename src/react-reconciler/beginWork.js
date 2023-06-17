import { mountChildFibers, reconcileChildFibers } from "./childFibers";
import { processUpdateQueue } from "./upDateQueue";
import { HostComponent, HostRoot, HostText } from "./workTags";

export function beginWork(wip) {
  switch (wip.tag) {
    case HostRoot:
      updateHostRoot(wip);
      return;
    case HostComponent:
      updateHostComponent(wip);
      return;
    case HostText:
      return null;
    default:
      throw new Error("Unknown fiber tag");
  }
}

function updateHostRoot(wip) {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue;
  const pending = updateQueue.shared.pending;

  updateQueue.shared.pending = null;

  // 初次渲染时，此处的 memoizedState 为 JSX
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;
  const nextChildren = wip.memoizedState;

  // 传入 workInProgress 和其 JSX
  reconcileChildren(wip, nextChildren);

  // 返回第一个子节点
  return wip.child;
}

function updateHostComponent(wip) {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function reconcileChildren(wip, children) {
  // 对比 currentFiber 和 JSX 生成对应的 childFiber
  const current = wip.alternate;
  if (current === null) {
    // mount
    wip.child = mountChildFibers(wip, null, children);
  } else {
    // update
    wip.child = reconcileChildFibers(wip, current, children);
  }
}
