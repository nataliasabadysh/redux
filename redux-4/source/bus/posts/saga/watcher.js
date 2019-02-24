// Core
import { takeEvery, all, call } from 'redux-saga/effects';

// Type
import { types } from '../types';

// Workers
import { createPost, fetchPosts } from './workers';

function* watcherCreatePost () {
    yield takeEvery(types.CREATE_POST_ASYNC, createPost);
}
// add
function* watchFillPosts () {
    yield takeEvery(types.FETCH_POST_ASYNC, fetchPosts);
}
export function* watchPost () {
    yield all([
        call(watcherCreatePost),
        call(watchFillPosts)
    ]);
}
