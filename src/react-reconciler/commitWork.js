import { MutationMask, NoFlags, Placement } from "./fiberFlags";
import { HostComponent, HostRoot } from "./workTags";

let nextEffect = null;
export function commitMutationEffects(finishedWork) {
  nextEffect = finishedWork;
  while (nextEffect) {
    const child = nextEffect.child;
    if (
      (nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
      child !== null
    ) {
      nextEffect = child;
    } else {
      while (nextEffect !== null) {
        commitMutationEffectsOnFiber(nextEffect);
        const sibling = nextEffect.sibling;
        if (sibling) {
          nextEffect = sibling;
          break;
        }
        nextEffect = nextEffect.return;
      }
    }
  }
}

function commitMutationEffectsOnFiber(finishedWork) {
  const flags = finishedWork.flags;
  if (flags & (Placement !== NoFlags)) {
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }
}

function commitPlacement(finishedWork) {
  const hostParent = getHostParent(finishedWork);
}

function getHostParent(fiber) {
  let parent = fiber.return;
  while (parent) {
    const parentTag = parent.tag;
    if (parentTag === HostComponent) {
      return parent.stateNode;
    }
    if (parentTag === HostRoot) {
      return parent.stateNode.containerInfo;
    }
    parent = parent.return;
  }
}
