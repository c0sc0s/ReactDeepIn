import { NoFlags } from "./fiberFlags";
import { FunctionComponent, HostComponent } from "./workTags";

export class FiberNode {
  constructor(tag, pendingProps, key) {
    this.tag = tag;
    this.key = key;

    this.type = null; //"div" function
    this.stateNode = null;

    this.child = null;
    this.sibling = null;
    this.return = null;
    this.index = 0;

    this.ref = null;

    this.pendingProps = pendingProps;
    this.memoizedProps = null;

    this.alternate = null;
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
    this.updateQueue = null;
    this.memoizedState = null;
  }
}

export class FiberRootNode {
  constructor(container, hostRootFiber) {
    this.container = container;
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    this.finshedWork = null;
  }
}

export function createWorkInProgress(current, pendingProps) {
  let wip = current.alternate;

  if (wip === null) {
    // This is the first render
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.stateNode = current.stateNode;

    wip.alternate = current;
    current.alternate = wip;
  } else {
    // This is an update
    wip.pendingProps = pendingProps;
    wip.flags = NoFlags;
    wip.subtreeFlags = NoFlags;
  }
  wip.type = current.type;
  wip.updateQueue = current.updateQueue;

  return wip;
}

export function createFiberFromElement(element) {
  const type = element.type;
  const key = element.key;
  const pendingProps = element.props;

  // 类组件还没处理
  let tag = FunctionComponent;
  if (typeof type === "string") {
    tag = HostComponent;
  }

  const fiber = new FiberNode(tag, pendingProps, key);
  fiber.type = type;

  return fiber;
}
