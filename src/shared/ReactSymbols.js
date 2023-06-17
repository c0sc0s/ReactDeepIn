const supportSymbols = typeof Symbol === "function" && Symbol.for;

const REACT_ELEMENT_TYPE = supportSymbols ? Symbol.for("mini_react") : 0xeac7;

export { REACT_ELEMENT_TYPE };
