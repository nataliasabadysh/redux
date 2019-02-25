// Core
import { takeEvery, all, call } from 'redux-saga/effects';

// Type
import { types } from '../types';

// Workers
import { worker } from './workers';

function* watcherWorker () {
    yield takeEvery(types.TYPE, worker);
}

export function* watchDomin () {
    yield all([
        call(watcherWorker)
    ]);
}
