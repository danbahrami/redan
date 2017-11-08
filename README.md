# Redan

Redan is an opinionated set of utility methods for [Redux](https://www.npmjs.com/package/redux). The library has two aims:

1. Enforce a standardized way of using Redux and Redux Thunk
2. Reduce the boilerplate required to use Redux

It's based on the work of [Redux Act](https://www.npmjs.com/package/redux-act) but with less magic and an extra focus on simplifying thunks.

*It's called Redan because it favours the way I (Dan) personally like to use Redux.*

## Install

```
yarn add redan
```

## Usage

Redan exports three utility functions.

- [createAction](#createaction)
- [creatErrorAction](#createerroraction)
- [createThunk](#createthunk)
- [example](#exampleusage)

You can import them like so:

```
import { createAction, createErrorAction, createThunk } from 'redan';
```

## Actions without action types

The basic idea is that using string constants to identify action types is messy. Here's an example of how action creators are normally used in Redux:

action-types.js
```
export const ADD_TODO = 'ADD_TODO';
export const COMPLETE_TODO = 'COMPLETE_TODO'
```

actions.js
```
import * as types from './action-types';

export const createAction(types.ADD_TODO);
export const createAction(types.COMPLETE_TODO);
```

reducer.js
```
import * as types from './action-types';

export default (state, action) => {
  switch (action.type) {
    case types.ADD_TODO:
      ...
    case types.COMPLETE_TODO:
      ...
  }
};
```

The problem is that having action type constants that are separate from the actions is causing indirection. If you want to find anywhere that the `addTodo` action is being used, you have to search for all usages of both `addTodo` and `ADD_TODO` in your codebase, because your reducer identifies the action using the string constant and your components will dispatch the action using the action creator.

But what if we make the action type accessible from the action creator?

```
const addTodo = createAction('ADD_TODO');

addTodo.type; // => 'ADD_TODO'
```

Now our code looks like this:

actions.js
```
import * as types from './action-types';

export const createAction('ADD_TODO');
export const createAction('COMPLETE_TODO');
```

reducer.js
```
import * as actions from './actions';

export default (state, action) => {
  switch (action.type) {
    case actions.addTodo.type:
      ...
    case actions.completeTodo.type:
      ...
  }
};
```

Now, by searching for 'addTodo' you can find all usages of the action. happy days 👍

## API

### createAction

Creates simple Redux action creators. It accepts a string as an action type and returns an action creator with the action type bound to it.

The action creator accepts a single `payload` argument which can be anything.

```
const addTodo = createAction('ADD_TODO');

addTodo('Buy milk'); // => { type: 'ADD_TODO', payload: 'Buy milk' }

/*
 * The action type is bound to the action creator
 */
addTodo.type; // => 'ADD_TODO'
```

### createErrorAction

Creates error action creators. It accepts a string as an action type and returns an error action creator with the action type bound to it.

The action creator accepts `error` and `payload` arguments.

```
const todoError = createErrorAction('TODO_ERROR');

todoError(new Error('invalid todo'), 'Dont buy milk'); // => { type: 'ADD_TODO', error: Error, payload: 'Dont buy milk' }

/*
 * The action type is bound to the action creator
 */
todoError.type; // => 'ADD_TODO'
```

### createThunk

Creates a thunk with start, end and error actions attached to it.

When creating a thunk, there are often 3 useful related actions to dispatch within the thunk:

- start - dispatched at the start of the thunk, often used to add loading state to the UI
- end - at the end of the thunk when everything has gone well. Often used to pass the result of some async call to the reducer.
- error - when some error was thrown, perhaps your API returns a 404. Used to tell the user that something went wrong

The `createThunk` utility accepts an action type and a callback. It creates these 3 useful actions and dispatches them for you. It also binds the 3 action types to itself so you can reference them in the reducer.

```
const fetchTodos = createThunk(
  'FETCH_TODOS', 
  user_id => async (dispatch, getState) => {
    const response = await fetch('www.todos.com/todos');
    return response.json();
  }
);

/*
 * The start, end and error types are bound to the thunk
 */
fetchTodos.start.type // => 'FETCH_TODOS_START'
fetchTodos.end.type // => 'FETCH_TODOS_END'
fetchTodos.error.type // => 'FETCH_TODOS_ERROR'
```

The callback is passed `dispatch` and `getState` just like a regular thunk in case you want to do anything more fancy and dispatch extra actions within your callback.

When `fetchTodos` is dispatched with redux-thunk the following happens:

#### The start action
The start action is dispatched. The payload is whatever payload is passed to the thunk.

```
dispatch(fetchTodos(123));

// dispatches { type: 'FETCH_TODOS_START', payload: 123 }
```

#### The end action
The end action is dispatched once the callback has completed. The callback can be asynchronous if you like. The payload of the end action is whatever is returned from the callback.

```
const fetchTodos = createThunk('FETCH_TODOS', user_id => () => {
  return 'hello';
});

// dispatches { type: 'FETCH_TODOS_END', payload: 'hello' }
```

The end action is **NOT** dispatched if the callback throws an error.

#### The error action

If the callback throws, the error action gets dispatched instead of the end action. The error action is passed the error and whatever payload was passed to the thunk.

```
const fetchTodos = createThunk('FETCH_TODOS', user_id => () => {
  throw new Error('oh no');
});

dispatch(fetchTodos(123));

// dispatches { type: 'FETCH_TODOS_ERROR', error: Error, payload: 123 }
```

## Example usage

actions.js
```
import { createAction, createThunk } from 'redan';

export const addTodo = createAction('ADD_TODO');
export const completeTodo = createAction('COMPLETE_TODO');

export const fetchTodos = createThunk('FETCH_TODOS', user_id => () => {
  const response = fetch('www.todos.com/todos');
  return response.json();
});
```

reducer.js
```
import * as actions from './actions';

export default (state, action) => {
  const { type, payload, error } = action;

  switch (type) {
    case actions.addTodo.type:
      return {
        ...state,
        todos: [ ...state.todos, payload ]
      };
    case actions.completeTodo.type:
      return {
        ...state,
        completed: [ ...state.completed, payload ]
      };
    case fetchTodos.start.type:
      return {
        ...state,
        isLoadingTodos: true,
        error: null
      };
    case fetchTodos.end.type:
      return {
        ...state,
        isLoadingTodos: false,
        todos: payload
      };
    case fetchTodos.error.type:
      return {
        ...state,
        isLoadingTodos: false,
        error: error.message
      };
    default:
      return state;
  }
}
```