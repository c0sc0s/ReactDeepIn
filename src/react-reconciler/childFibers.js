import { REACT_ELEMENT_TYPE } from "../shared/ReactSymbols";
import {
  FiberNode,
  createFiberFromElement,
  createWorkInProgress,
} from "./fiber";
import { Placement } from "./fiberFlags";
import { HostText } from "./workTags";

function useFiber(fiber, pendingProps) {
  const clone = createWorkInProgress(fiber, pendingProps);
  clone.index = 0;
  clone.sibling = null;
  return clone;
}

function ChildReconciler(shouldTrackEffects) {
  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackEffects) {
      return;
    }
    const deletions = returnFiber.deletions;
    if (deletions === null) {
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      deletions.push(childToDelete);
    }
  }

  //根据JSX生成对应的 Fiber
  function reconcileSingleElement(returnFiber, currentFiber, element) {
    const key = element.key;
    if (currentFiber !== null) {
      // update
      if (currentFiber.key === key) {
        if ((element.$$typeof = REACT_ELEMENT_TYPE)) {
          if ((currentFiber.type = element.type)) {
            // 复用
            const existing = useFiber(currentFiber, element.props);
            existing.return = returnFiber;
            return existing;
          } else {
            deleteChild(returnFiber, currentFiber);
          }
        } else {
          console.warn("Not implemented");
        }
      } else {
        deleteChild(returnFiber, currentFiber);
      }
    } else {
    }

    const fiber = createFiberFromElement(element);
    fiber.return = returnFiber;
    return fiber;
  }

  //生成文本节点对应的 Fiber
  function reconcileSingleTextNode(returnFiber, currentFiber, content) {
    if (currentFiber !== null) {
      // update
      if (currentFiber.tag === HostText) {
        // 复用
        const existing = useFiber(currentFiber, { content });
        existing.return = returnFiber;
        return existing;
      }
      // currentFiber不是文本节点
      deleteChild(returnFiber, currentFiber);
    }
    const fiber = new FiberNode(HostText, { content }, null);
    fiber.return = returnFiber;
    return fiber;
  }

  function placeSingleChild(newFiber) {
    if (shouldTrackEffects && newFiber.alternate === null) {
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  return function reconcileChildrenFibers(returnFiber, currentFiber, newChild) {
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFiber, newChild)
          );
        default:
          console.warn("Unknown child type");
          break;
      }
    }

    if (typeof newChild === "string" || typeof newChild === "number") {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild)
      );
    }
  };
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
