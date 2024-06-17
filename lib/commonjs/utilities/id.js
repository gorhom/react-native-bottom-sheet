"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.id = void 0;
let current = 0;
const id = () => {
  current = (current + 1) % Number.MAX_SAFE_INTEGER;
  return current;
};
exports.id = id;
//# sourceMappingURL=id.js.map