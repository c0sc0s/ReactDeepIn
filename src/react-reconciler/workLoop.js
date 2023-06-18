import { beginWork } from "./beginWork";
import { commitMutationEffects } from "./commitWork";
import { completeWork } from "./completeWork";
import { createWorkInProgress } from "./fiber";
import { MutationMask, NoFlags } from "./fiberFlags";
import { HostRoot } from "./workTags";

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

function commitRoot(root) {
  const finishedWork = root.finishedWork;
  if (finishedWork === null) return;

  root.finishedWork = null;

  const subtreeHasEffects =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags;

  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

  if (subtreeHasEffects || rootHasEffect) {
    // beforeMutation
    // mutation
    root.current = finishedWork;
    commitMutationEffects(finishedWork);
    // layout
  } else {
    root.current = finishedWork;
  }
}

function workLoop() {
  while (workInProgress) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber) {
  console.log("d", fiber);
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
