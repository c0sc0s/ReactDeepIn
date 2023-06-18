import { MutationMask, NoFlags, Placement } from "./fiberFlags";
import { appendChildToContainer } from "../react-dom/hostConfig";
import { HostComponent, HostRoot, HostText } from "./workTags";

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
      //
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
  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }
  // update
  // childDeletion
}

function commitPlacement(finishedWork) {
  // 1. 找到父节点
  const hostParent = getHostParent(finishedWork);
  appendPlacementNodeIntoContainer(finishedWork, hostParent);
}

function getHostParent(fiber) {
  let parent = fiber.return;
  while (parent) {
    const parentTag = parent.tag;
    if (parentTag === HostComponent) {
      return parent.stateNode;
    }
    if (parentTag === HostRoot) {
      return parent.stateNode.container;
    }
    parent = parent.return;
  }
}

function appendPlacementNodeIntoContainer(finishedWork, hostParent) {
  // 找到 HostComponent 或者 HostText
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    appendChildToContainer(finishedWork.stateNode, hostParent);
  }

  const child = finishedWork.child;
  if (child) {
    appendPlacementNodeIntoContainer(child, hostParent);
    let sibling = child.sibling;
    while (sibling) {
      appendPlacementNodeIntoContainer(sibling, hostParent);
      sibling = sibling.sibling;
    }
  }
}
