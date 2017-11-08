import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import createThunk from '../src/create-thunk';
import createAction from '../src/create-action';
import createErrorAction from '../src/create-error-action';

const store = configureStore([thunk])({});

const ERROR = new Error('ONO');
const PAYLOAD = { foo: 'bar' };
const FAKE_ACTION = { type: 'FAKE', payload: 'FAKE' };
const CALLBACK_RETURN = 'callback return value';

describe('createThunk', () => {
  const callback = jest.fn();

  beforeEach(() => {
    store.clearActions();
    callback.mockClear();
    callback.mockImplementation(payload => dispatch => {
      dispatch(FAKE_ACTION);
      return CALLBACK_RETURN;
    });
  });

  it('binds a start action to the thunk', () => {
    const thunk = createThunk('THUNK', () => {});

    expect(thunk.start(PAYLOAD)).toEqual(createAction('THUNK_START')(PAYLOAD));
    expect(thunk.start.type).toBe('THUNK_START');
  });

  it('binds an end action to the thunk', () => {
    const thunk = createThunk('THUNK', () => {});

    expect(thunk.end(PAYLOAD)).toEqual(createAction('THUNK_END')(PAYLOAD));
    expect(thunk.end.type).toBe('THUNK_END');
  });

  it('binds an error action to the thunk', () => {
    const thunk = createThunk('THUNK', () => {});

    expect(thunk.error(ERROR, PAYLOAD)).toEqual(
      createErrorAction('THUNK_ERROR')(ERROR, PAYLOAD)
    );
    expect(thunk.error.type).toBe('THUNK_ERROR');
  });

  describe('when dispatched', () => {
    it('dispatches the start action with the payload', () => {
      const thunk = createThunk('THUNK', callback);

      store.dispatch(thunk(PAYLOAD));

      expect(store.getActions()[0]).toEqual(
        createAction('THUNK_START')(PAYLOAD)
      );
    });

    it('dispatches the callback', () => {
      const thunk = createThunk('THUNK', callback);

      store.dispatch(thunk(PAYLOAD));

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(PAYLOAD);
      expect(store.getActions()[1]).toBe(FAKE_ACTION);
    });

    it('dispatches the end action with the return value of the callback', async () => {
      const thunk = createThunk('THUNK', callback);

      await store.dispatch(thunk(PAYLOAD));

      expect(store.getActions()[2]).toEqual(
        createAction('THUNK_END')(CALLBACK_RETURN)
      );
    });

    it('does not dispatch an error action', () => {
      const thunk = createThunk('THUNK', callback);

      store.dispatch(thunk(PAYLOAD));

      store.getActions().forEach(action => {
        expect(action.type).not.toBe('THUNK_ERROR');
      });
    });

    describe('when the callback is async', () => {
      beforeEach(() => {
        const later = () =>
          new Promise(resolve => setTimeout(resolve, 1, CALLBACK_RETURN));

        callback.mockImplementation(payload => async dispatch => {
          return await later();
        });
      });

      it('waits to dispatch the end action', async () => {
        const thunk = createThunk('THUNK', callback);

        await store.dispatch(thunk(PAYLOAD));

        expect(store.getActions()[1]).toEqual(
          createAction('THUNK_END')(CALLBACK_RETURN)
        );
      });
    });

    describe('when the callback throws an error', () => {
      const ERROR = new Error('Whoops');

      beforeEach(() => {
        callback.mockImplementation(() => {
          throw ERROR;
        });
      });

      it('dispatches a start action', () => {
        const thunk = createThunk('THUNK', callback);

        store.dispatch(thunk(PAYLOAD));

        expect(store.getActions()[0]).toEqual(
          createAction('THUNK_START')(PAYLOAD)
        );
      });

      it('dispatches an error action', () => {
        const thunk = createThunk('THUNK', callback);

        store.dispatch(thunk(PAYLOAD));

        expect(store.getActions()[1]).toEqual(
          createErrorAction('THUNK_ERROR')(ERROR, PAYLOAD)
        );
      });

      it('does not dispatch an end action', () => {
        const thunk = createThunk('THUNK', callback);

        store.dispatch(thunk(PAYLOAD));

        store.getActions().forEach(action => {
          expect(action.type).not.toBe('THUNK_END');
        });
      });
    });
  });
});
