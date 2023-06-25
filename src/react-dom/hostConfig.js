import { HostComponent, HostText } from "../react-reconciler/workTags";

export const createInstance = (type, props) => {
  const element = document.createElement(type);
  return element;
};
export const appendInitialChild = (parent, child) => {
  parent.appendChild(child);
};
export const createTextInstance = (content) => {
  return document.createTextNode(content);
};
export const appendChildToContainer = appendInitialChild;

export const commitUpdate = (fiber) => {
  switch (fiber.tag) {
    case HostText:
      const text = fiber.memoizedProps.content;
      break;

    default:
      console.warn(`Cannot commit update"${fiber.tag}`);
      break;
  }
};

function commitTextUpdate(textInstance, content) {
  textInstance.textContent = content;
}
