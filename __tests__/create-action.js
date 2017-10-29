import createAction from '../src/create-action';

const TYPE = 'JOHN_LENNON';
const PAYLOAD = { foo: 'bar' };

describe('createAction', () => {
  it('accepts a type and returns an action creator function', () => {
    const actionCreator = createAction(TYPE);
    const action = actionCreator(PAYLOAD);

    expect(action).toEqual({
      type: TYPE,
      payload: PAYLOAD,
    });
  });

  it('binds the action type to the action creator', () => {
    const actionCreator = createAction(TYPE);

    expect(actionCreator.type).toBe(TYPE);
  });
});
