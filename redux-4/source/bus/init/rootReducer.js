// Core
import { combineReducers } from 'redux';

// Reducers
import { postReducer as posts } from '../posts/reducer';
import { uiReducer as ui } from '../ui/reducer';

export const rootReducer = combineReducers({
    posts,
    ui,
});
