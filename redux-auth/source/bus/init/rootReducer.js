// Core
import { combineReducers } from 'redux';

// Reducers
import { postReducer as posts } from '../posts/reducer';
import { uiReducer as ui } from '../ui/reducer';
import { authReducer as auth } from '../auth/reducer';
import { profileReducer as profile } from '../profile/reducer';

export const rootReducer = combineReducers({
    auth,
    ui,
    posts,
    profile,
});
