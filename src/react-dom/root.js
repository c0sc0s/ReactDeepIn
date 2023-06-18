import {
  createContainer,
  updateContainer,
} from "../react-reconciler/fiberReconciler";

export function createRoot(container) {
  const root = createContainer(container);
  return {
    render(element) {
      updateContainer(element, root);
    },
  };
}
