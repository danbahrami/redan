import createAction from './create-action';
import createErrorAction from './create-error-action';

const createThunk = (type, callback) => {
  const start = createAction(type + '_START');
  const end = createAction(type + '_END');
  const error = createErrorAction(type + '_ERROR');

  const thunk = payload => async dispatch => {
    dispatch(start(payload));

    try {
      const result = await dispatch(callback(payload));
      dispatch(end(result));
    } catch (err) {
      dispatch(error(err, payload));
    }
  };

  thunk.start = start;
  thunk.end = end;
  thunk.error = error;

  return thunk;
};

export default createThunk;
