"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createAction = function createAction(type) {
  var action = function action(payload) {
    return { type: type, payload: payload };
  };

  action.type = type;

  return action;
};

exports.default = createAction;