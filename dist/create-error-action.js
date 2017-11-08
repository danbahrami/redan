"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createErrorAction = function createErrorAction(type) {
  var action = function action(error, payload) {
    return { type: type, error: error, payload: payload };
  };

  action.type = type;

  return action;
};

exports.default = createErrorAction;