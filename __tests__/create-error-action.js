import createErrorAction from '../src/create-error-action';

const TYPE = 'JOHN_LENNON';
const ERROR = new Error('ONO');
const PAYLOAD = { foo: 'bar' };

describe('createErrorAction', () => {
  it('accepts a type and returns an error action creator function', () => {
    const actionCreator = createErrorAction(TYPE);
    const action = actionCreator(ERROR, PAYLOAD);

    expect(action).toEqual({
      type: TYPE,
      error: ERROR,
      payload: PAYLOAD,
    });
  });

  it('binds the action type to the action creator', () => {
    const actionCreator = createErrorAction(TYPE);

    expect(actionCreator.type).toBe(TYPE);
  });
});
