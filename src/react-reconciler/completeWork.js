import { NoFlags } from "./fiberFlags";
import {
  appendInitialChild,
  createInstance,
  createTextInstance,
} from "../react-dom/hostConfig";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./workTags";

export function completeWork(wip) {
  const newProps = wip.pendingProps;
  const current = wip.alternate;

  switch (wip.tag) {
    case HostComponent:
      if (current && wip.stateNode) {
        // update
      } else {
        // 构建DOM
        const instance = createInstance(wip.type, newProps);
        appendAllChildren(instance, wip);
        wip.stateNode = instance;
      }
      bubbelProperties(wip);
      return null;
    case HostText:
      if (current && wip.stateNode) {
        // update
      } else {
        // 构建DOM
        const instance = createTextInstance(newProps.content);
        wip.stateNode = instance;
      }
      bubbelProperties(wip);
      return null;
    case HostRoot:
      bubbelProperties(wip);
      return null;
    case FunctionComponent:
      bubbelProperties(wip);
      return null;
    default:
      break;
  }
}

function appendAllChildren(parent, wip) {
  let node = wip.child;
  while (node) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node?.stateNode);
    } else if (node.child) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === wip) return;

    while (!node.sibling) {
      if (node.return === null || node.return === wip) return;
      node = node?.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function bubbelProperties(wip) {
  let subtreeFlags = NoFlags;
  let child = wip.child;

  while (child) {
    subtreeFlags |= child.flags;
    subtreeFlags |= child.subtreeFlags;

    child.return = wip;
    child = child.sibling;
  }
  wip.subtreeFlags = subtreeFlags;
}
