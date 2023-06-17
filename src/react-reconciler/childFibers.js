import { REACT_ELEMENT_TYPE } from "../shared/ReactSymbols";
import { FiberNode, createFiberFromElement } from "./fiber";
import { Placement } from "./fiberFlags";
import { HostText } from "./workTags";

function ChildReconciler(shouldTrackEffects) {
  //根据JSX生成对应的 Fiber
  function reconcileSingleElement(returnFiber, currentFiber, element) {
    const fiber = createFiberFromElement(element);
    fiber.return = returnFiber;
    return fiber;
  }

  //生成文本节点对应的 Fiber
  function reconcileSingleTextNode(returnFiber, currentFiber, content) {
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
