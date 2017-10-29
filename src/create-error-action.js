const createErrorAction = type => {
  const action = (error, payload) => ({ type, error, payload });

  action.type = type;

  return action;
};

export default createErrorAction;
