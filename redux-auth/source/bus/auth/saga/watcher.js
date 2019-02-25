// Core
import { takeEvery, all, call } from 'redux-saga/effects';

// Type
import { types } from '../types';

// Workers
import { signup } from './workers';

function* watchSignup () {
    yield takeEvery(types.SINGUP_ASYNC, signup);
}
function* watchLogin () {
    yield takeEvery(types.LOGIN_ASYNC, login);
}

export function* watchAuth () {
    yield all([
        call(watchSignup),
        call(watchLogin)
    ]);
}
