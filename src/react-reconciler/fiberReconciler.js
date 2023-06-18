import { FiberNode, FiberRootNode } from "./fiber";
import { createUpdate, createUpdateQueue, enqueueUpdate } from "./upDateQueue";
import { scheduleUpdateOnFiber } from "./workLoop";
import { HostRoot } from "./workTags";

export function createContainer(container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  hostRootFiber.updateQueue = createUpdateQueue();

  return new FiberRootNode(container, hostRootFiber);
}

export function updateContainer(element, root) {
  const hostRootFiber = root.current;
  const update = createUpdate(element);
  enqueueUpdate(hostRootFiber.updateQueue, update);
  scheduleUpdateOnFiber(hostRootFiber);
}
