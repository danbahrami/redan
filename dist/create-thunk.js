'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
    return function (dispatch) {
      dispatch(start(payload));

      try {
        var result = dispatch(callback(payload));
        dispatch(end(result));
      } catch (err) {
        dispatch(error(err, payload));
      }
    };
  };

  thunk.start = start;
  thunk.end = end;
  thunk.error = error;

  return thunk;
};

exports.default = createThunk;