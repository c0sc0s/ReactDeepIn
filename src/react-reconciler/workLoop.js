import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { createWorkInProgress } from "./fiber";

let workInProgress = null;

function markUpdateFromFiberToRoot(fiber) {
  let node = fiber;
  do {
    if (node.tag === HostRoot) {
      return node.stateNode;
    }
    node = node.return;
  } while (node !== null);
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
}

export function scheduleUpdateOnFiber(fiber) {
  const root = markUpdateFromFiberToRoot(fiber);
  renderRoot(root);
}

function renderRoot(root) {
  prepareFreshStack(root);

  do {
    try {
      workLoop();
      break;
    } catch (e) {
      console.warn(e);
      workInProgress = null;
    }
  } while (true);

  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;

  commitRoot(root);
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber) {
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;

  if (next !== null) {
    workInProgress = next;
  } else {
    completeUnitOfWork(fiber);
  }
}

function completeUnitOfWork(fiber) {
  let node = fiber;
  do {
    completeWork(node);
    const sibling = node.sibling;

    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }

    node = node.return;
    workInProgress = node;
  } while (node !== null);
}
