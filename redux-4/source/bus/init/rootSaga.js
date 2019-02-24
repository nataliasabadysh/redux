// Core
import { all, call } from 'redux-saga/effects';

// Watcer
import { watchPost } from '../../bus/posts/saga/watcher';

export function* rootSaga () {
    yield all([call(watchPost)]);
}
