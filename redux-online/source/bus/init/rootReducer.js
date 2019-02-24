// Core
import { combineReducers } from 'redux';

// Reducers
import { postReducer as posts } from '../posts/reducer';

export const rootReducer = combineReducers({
    posts,
});
