"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSnapPoint = void 0;
var _invariant = _interopRequireDefault(require("invariant"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const validateSnapPoint = snapPoint => {
  (0, _invariant.default)(typeof snapPoint === 'number' || typeof snapPoint === 'string', `'${snapPoint}' is not a valid snap point! expected types are string or number.`);
  (0, _invariant.default)(typeof snapPoint === 'number' || typeof snapPoint === 'string' && snapPoint.includes('%'), `'${snapPoint}' is not a valid percentage snap point! expected percentage snap point must include '%'. e.g. '50%'`);
  (0, _invariant.default)(typeof snapPoint === 'number' || typeof snapPoint === 'string' && Number(snapPoint.split('%')[0]), `'${snapPoint}' is not a valid percentage snap point! expected percentage snap point must be only numbers and '%'. e.g. '50%'`);
};
exports.validateSnapPoint = validateSnapPoint;
//# sourceMappingURL=validateSnapPoint.js.map