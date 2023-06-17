import { REACT_ELEMENT_TYPE } from "../shared/ReactSymbols";

const ReactELement = function (type, key, ref, props) {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    _owner: null,
  };
  return element;
};

const isValidKey = (config) => !!config.key;
const isValidRef = (config) => !!config.ref;

export const jsx = function (type, config) {
  const props = {};

  const key = isValidKey(config) ? config.key.toString() : null;
  const ref = isValidRef(config) ? config.ref : null;

  config = config || {};

  Object.keys(config).forEach((key) => {
    if (key !== "key" && key !== "ref") {
      props[key] = config[key];
    }
  });

  return ReactELement(type, key, ref, props);
};
