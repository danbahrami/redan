'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _createAction = require('./create-action');

var _createAction2 = _interopRequireDefault(_createAction);

var _createErrorAction = require('./create-error-action');

var _createErrorAction2 = _interopRequireDefault(_createErrorAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createThunk = function createThunk(type, callback) {
  var start = (0, _createAction2.default)(type + '_START');
  var end = (0, _createAction2.default)(type + '_END');
  var error = (0, _createErrorAction2.default)(type + '_ERROR');

  var thunk = function thunk(payload) {
    return function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(dispatch) {
        var result;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                dispatch(start(payload));

                _context.prev = 1;
                _context.next = 4;
                return dispatch(callback(payload));

              case 4:
                result = _context.sent;

                dispatch(end(result));
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](1);

                dispatch(error(_context.t0, payload));

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[1, 8]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();
  };

  thunk.start = start;
  thunk.end = end;
  thunk.error = error;

  return thunk;
};

exports.default = createThunk;