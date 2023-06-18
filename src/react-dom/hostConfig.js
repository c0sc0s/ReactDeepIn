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
