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
addTodo.type; // => 'ADD_TODO'
```

### createErrorAction

Creates error action creators. It accepts a string as an action type and returns an error action creator with the action type bound to it.

The action creator accepts `error` and `payload` arguments.

```
const todoError = createErrorAction('TODO_ERROR');

todoError(new Error('invalid todo'), 'Dont buy milk'); // => { type: 'ADD_TODO', error: Error, payload: 'Dont buy milk' }
todoError.type; // => 'ADD_TODO'
```

### createThunk

Creates a thunk with start, end and error actions attached to it.

```
WIP
```