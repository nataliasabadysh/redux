// Core
import { all, call } from 'redux-saga/effects';

// Watcer
import { watchPost } from '../posts/saga/watcher';
import { watchAuth } from '../auth/saga/watcher';

export function* rootSaga () {
    yield all([call(watchPost), call(watchAuth)]);
}
